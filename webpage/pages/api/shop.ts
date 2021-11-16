import type { NextApiRequest, NextApiResponse } from "next";

import { FILTER_NON_DRAFTS } from "../../../constants";
import { ResolvedProduct } from "../../types";
import { sanityClient } from "../../utils/sanityClient";
import { pieceProjection } from "../../utils/queries";

const SHOP_QUERY = `*[ _type == "shop" && ${FILTER_NON_DRAFTS} ]{
  products[] -> {
    _id,
    price,
    stock,
    "piece": piece -> {
      ${pieceProjection}
    }
  }
}[0]`;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResolvedProduct | string>
) => {
  const landing = await sanityClient.fetch(SHOP_QUERY);

  if (!landing) {
    res.status(404).send("Landing not found");
    return;
  }

  res.status(200).json(landing);
};
