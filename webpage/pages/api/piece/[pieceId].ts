import type { NextApiRequest, NextApiResponse } from "next";

import { ResolvedPiece } from "../../../types";
import { sanityClient } from "../../../utils/sanityClient";

const PIECE_QUERY = `*[ _type == "piece" && _id == $pieceId ]{
  _id,
  title,
  "category": category -> title,
  description,
  colour,
  material,
  care,
  size,
  images {
    _key,
    asset ->
  }
}[0]`;

export default async (req: NextApiRequest, res: NextApiResponse<ResolvedPiece | string>) => {
  const { pieceId } = req.query;
  const piece: ResolvedPiece = await sanityClient.fetch(PIECE_QUERY, {
    pieceId,
  });

  if (!piece) {
    res.status(404).send(`Piece "${pieceId}" not found`);
    return;
  }

  res.status(200).json(piece);
};
