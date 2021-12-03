import { ResolvedPiece } from "../types";
import { FILTER_NON_DRAFTS } from "../../constants";
import { sanityClient } from "../utils/sanityClient";
import { pieceProjection } from "../utils/queries";

const ILLUSTRATIONS_QUERY = `*[ _type == "piece" && ${FILTER_NON_DRAFTS} && category -> title == "Illustration" ]{
  ${pieceProjection}
}`;

const getIllustrations = (): Promise<ResolvedPiece[]> => sanityClient.fetch(ILLUSTRATIONS_QUERY);

export default getIllustrations;
