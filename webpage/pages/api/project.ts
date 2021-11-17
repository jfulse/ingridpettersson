import type { NextApiRequest, NextApiResponse } from "next";

import { ResolvedProject } from "../../types";
import { sanityClient } from "../../utils/sanityClient";
import slugify from "../../utils/slugify";

const PROJECT_QUERY = `*[ _type == "project" && !(_id in path('drafts.**'))]{
  _id,
  title,
  images[] { _key, asset -> },
  year
}`;

export default async (req: NextApiRequest, res: NextApiResponse<ResolvedProject | string>) => {
  const { slug } = req.query;
  const projects = await sanityClient.fetch(PROJECT_QUERY);
  const project = projects.find(({ title }: ResolvedProject) => slugify(title) === slug);

  if (!project) {
    res.status(404).send(`Project "${slug}" not found`);
    return;
  }

  res.status(200).json(project);
};
