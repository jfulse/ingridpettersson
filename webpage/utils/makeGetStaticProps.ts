import { GetStaticPropsResult, GetStaticPropsContext } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { get, orderBy } from "lodash/fp";

import { ResolvedProject } from "../types";
import getProjects from "../queries/getProjects";
import { EMPTY_ARRAY } from "../constants";

export type Props<T = null> = {
  slug: string | string[] | null;
  data: T | null;
  projects: ResolvedProject[];
  params: NextParsedUrlQuery | null;
};

const orderByYear = orderBy(get("year"), "desc");

const makeGetStaticProps =
  <T>(
    getData?: (params: NextParsedUrlQuery | null) => Promise<T>,
    getSlug?: (params: NextParsedUrlQuery | null) => string | string[] | null
  ) =>
  async (context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props<T>>> => {
    try {
      const { params = null } = context;
      const data = (await getData?.(params)) ?? null;
      const slug = getSlug?.(params) ?? null;

      if (getData && !data) throw new Error("Could not get data server side");
      if (getSlug && !slug) throw new Error("Could not get slug server side");

      const projects = orderByYear(await getProjects()) ?? EMPTY_ARRAY;

      return { props: { data, projects, params, slug }, revalidate: 10 };
    } catch (err) {
      console.error(err);
      return { notFound: true };
    }
  };

export default makeGetStaticProps;
