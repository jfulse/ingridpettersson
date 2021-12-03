import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { FILTER_NON_DRAFTS } from "../../constants";
import { ResolvedPiece } from "../types";
import { sanityClient } from "../utils/sanityClient";

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
  }[],
  'product': *[ _type == 'product' && piece._ref == $pieceId && ${FILTER_NON_DRAFTS}] {
    _id,
    price,
    stock,
    reserved
  }[0]
}[0]`;

const getPiece = async (params: NextParsedUrlQuery | null): Promise<ResolvedPiece | null> => {
  if (!params?.pieceId) {
    console.error("pieceId not found");
    return null;
  }

  const { pieceId } = params;

  const piece: ResolvedPiece = await sanityClient.fetch(PIECE_QUERY, {
    pieceId,
  });

  if (!piece) {
    console.error("Piece not found from id");
    return null;
  }

  return piece;
};

export default getPiece;
