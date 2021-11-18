import type { NextApiRequest, NextApiResponse } from "next";

import { FILTER_NON_DRAFTS } from "../../../constants";
import { ResolvedProject } from "../../types";
import { sanityClient } from "../../utils/sanityClient";

const PROJECTS_QUERY = `*[ _type == "project" && ${FILTER_NON_DRAFTS}]{
  _id,
  title,
  year
}`;

export default async (req: NextApiRequest, res: NextApiResponse<ResolvedProject[]>) => {
  const projects = await sanityClient.fetch(PROJECTS_QUERY);

  res.status(200).json(projects);
};
