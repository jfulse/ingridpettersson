import type { NextApiRequest, NextApiResponse } from "next";

import { FILTER_NON_DRAFTS } from "../../../constants";
import { ResolvedProject } from "../../types";
import { sanityClient } from "../../utils/sanityClient";

const BIO_QUERY = `*[ _type == "bio" && ${FILTER_NON_DRAFTS} ]{
  headline,
  body
}[0]`;

export default async (req: NextApiRequest, res: NextApiResponse<ResolvedProject | string>) => {
  const bio = await sanityClient.fetch(BIO_QUERY);

  if (!bio) {
    res.status(404).send("Bio found");
    return;
  }

  res.status(200).json(bio);
};
