import type { NextApiRequest, NextApiResponse } from "next";

import { ResolvedPiece } from "../../types";
import { FILTER_NON_DRAFTS } from "../../../constants";
import { sanityClient } from "../../utils/sanityClient";
import { pieceProjection } from "../../utils/queries";

const ILLUSTRATIONS_QUERY = `*[ _type == "piece" && ${FILTER_NON_DRAFTS} && category -> title == "Illustration" ]{
  ${pieceProjection}
}`;

export default async (req: NextApiRequest, res: NextApiResponse<ResolvedPiece | string>) => {
  const illustrations = await sanityClient.fetch(ILLUSTRATIONS_QUERY);

  res.status(200).json(illustrations);
};
