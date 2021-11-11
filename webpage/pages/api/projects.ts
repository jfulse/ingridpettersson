import type { NextApiRequest, NextApiResponse } from "next";

import { ResolvedProject } from "../../types";
import { sanityClient } from "../../utils/sanityClient";

const PROJECTS_QUERY = `*[ _type == "project" && !(_id in path('drafts.**'))]{
  _id,
  title,
  year
}`;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResolvedProject[]>
) => {
  const projects = await sanityClient.fetch(PROJECTS_QUERY);

  res.status(200).json(projects);
};
