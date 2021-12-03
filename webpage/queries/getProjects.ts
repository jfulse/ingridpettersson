import { FILTER_NON_DRAFTS } from "../../constants";
import { ResolvedProject } from "../types";
import { sanityClient } from "../utils/sanityClient";

const PROJECTS_QUERY = `*[ _type == "project" && ${FILTER_NON_DRAFTS}]{
  _id,
  title,
  year
}`;

const getProjects = (): Promise<ResolvedProject[]> => sanityClient.fetch(PROJECTS_QUERY);

export default getProjects;
