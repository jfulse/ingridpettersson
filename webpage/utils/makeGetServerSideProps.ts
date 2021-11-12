import { GetServerSidePropsResult, GetServerSidePropsContext } from "next";

import fetcher from "./fetcher";

type ContextToString = (
  context: GetServerSidePropsContext
) => string | string[] | undefined;

export type Props<T> = {
  slug?: string;
  apiUrl?: string;
  data?: T;
};

const makeGetServerSideProps =
  <T>(getSlug: ContextToString, getApiUrl: ContextToString) =>
  async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<Props<T>>> => {
    try {
      const slug = getSlug(context);

      if (slug && typeof slug !== "string") {
        throw new Error("Slug should be a string");
      }

      const apiUrl = getApiUrl(context);

      if (typeof apiUrl !== "string") {
        throw new Error("Could not get api url server side");
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
