import { GetServerSidePropsResult, GetServerSidePropsContext } from "next";

import fetcher from "./fetcher";

// TODO: Use getStaticProps and getStaticPaths instead
// - getStaticProps with 'revalidate' like 10 etc (10s)
// - getStaticPaths with 'paths' like something in the example after
// https://nextjs.org/docs/basic-features/data-fetching#fallback-false
// and fallback: blocking

type ContextToString = (context: GetServerSidePropsContext) => string | string[] | undefined;

export type Props<T> = {
  slug?: string | null;
  apiUrl?: string;
  data?: T;
};

const makeGetServerSideProps =
  <T>(getApiUrl: ContextToString, getSlug?: ContextToString) =>
  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props<T>>> => {
    try {
      const apiUrl = getApiUrl(context);

      if (typeof apiUrl !== "string") {
        throw new Error("Could not get api url server side");
      }

      const slug = getSlug?.(context) ?? null;

      if (slug && typeof slug !== "string") {
        throw new Error("Slug should be a string");
      }

      const data = await fetcher(apiUrl);

      if (!data) {
        throw new Error("Could not get data server side");
      }

      return { props: { slug, data, apiUrl } };
    } catch (err) {
      console.error(err);
      return { notFound: true };
    }
  };

export default makeGetServerSideProps;
