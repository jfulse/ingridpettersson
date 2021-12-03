import { GetStaticPropsResult, GetStaticPropsContext } from "next";
import { get, orderBy } from "lodash/fp";

import { ResolvedProject } from "../types";
import { EMPTY_ARRAY } from "../constants";
import fetcher from "./fetcher";
import getProjectsApiUrl from "./getProjectsApiUrl";

// - getStaticProps with 'revalidate' like 10 etc (10s)
// - getStaticPaths with 'paths' like something in the example after
// https://nextjs.org/docs/basic-features/data-fetching#fallback-false
// and fallback: blocking

type ContextToString = (context: GetStaticPropsContext) => string | undefined;
type ContextToStringOrStringArray = (context: GetStaticPropsContext) => string | string[] | undefined;

export type Props<T = null> = {
  slug?: string | null;
  dataUrl: string;
  data: T | null;
  projects: ResolvedProject[];
};

const orderByYear = orderBy(get("year"), "desc");

const makeGetStaticProps =
  <T>(getDataUrl?: ContextToString, getSlug?: ContextToStringOrStringArray) =>
  async (context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props<T>>> => {
    try {
      const dataUrl = getDataUrl?.(context) ?? "";

      if (getDataUrl && !dataUrl) {
        throw new Error("Could not get api url server side");
      }

      const slug = getSlug?.(context) ?? null;

      if (slug && typeof slug !== "string") {
        throw new Error("Slug should be a string");
      }

      const data = dataUrl ? await fetcher<T>(dataUrl) : null;
      const projectsData = await fetcher<ResolvedProject[]>(getProjectsApiUrl());
      const projects = orderByYear(projectsData) ?? EMPTY_ARRAY;

      if (getDataUrl && !data) {
        throw new Error("Could not get data server side");
      }

      return { props: { slug, data, dataUrl, projects }, revalidate: 10 };
    } catch (err) {
      console.error(err);
      return { notFound: true };
    }
  };

export default makeGetStaticProps;
