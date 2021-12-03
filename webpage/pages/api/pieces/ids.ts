import type { NextApiRequest, NextApiResponse } from "next";
import { FILTER_NON_DRAFTS } from "../../../../constants";

import { sanityClient } from "../../../utils/sanityClient";

const IDS_QUERY = `*[ _type == "piece" && ${FILTER_NON_DRAFTS} ][]._id`;

export default async (_: NextApiRequest, res: NextApiResponse<string[] | string>) => {
  const ids = await sanityClient.fetch<string[]>(IDS_QUERY);

  res.status(200).json(ids);
};
