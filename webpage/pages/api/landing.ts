import type { NextApiRequest, NextApiResponse } from "next";

import { ResolvedProject } from "../../types";
import { sanityClient } from "../../utils/sanityClient";

const LANDING_QUERY = `*[ _type == "frontPage" && !(_id in path('drafts.**'))]{
  pieces[] -> {
    _id,
    title,
    "firstImage": images {
      _key, asset ->
    }[0]
  }
}[0]`;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResolvedProject | string>
) => {
  const landing = await sanityClient.fetch(LANDING_QUERY);

  if (!landing) {
    res.status(404).send("Landing not found");
    return;
  }

  res.status(200).json(landing);
};
