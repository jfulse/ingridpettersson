import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { FILTER_NON_DRAFTS } from "../../constants";
import { ResolvedProject } from "../types";
import { sanityClient } from "../utils/sanityClient";
import slugify from "../utils/slugify";

const PROJECT_QUERY = `*[ _type == "project" && ${FILTER_NON_DRAFTS}]{
  _id,
  title,
  year,
  images[] { _key, _type, url, asset -> }
}`;

const getProject = async (params: NextParsedUrlQuery | null): Promise<ResolvedProject | null> => {
  if (!params?.projectSlug) {
    console.log("Could not find project slug from params");
    return null;
  }

  const projects = await sanityClient.fetch(PROJECT_QUERY);
  const project = projects.find(({ title }: ResolvedProject) => slugify(title) === params?.projectSlug);

  if (!project) {
    console.log("Could not find project from slug");
    return null;
  }

  return project;
};

export default getProject;
