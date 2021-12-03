import { FILTER_NON_DRAFTS } from "../../constants";
import { ResolvedPiece } from "../types";
import { sanityClient } from "../utils/sanityClient";
import { pieceProjection } from "../utils/queries";

const LANDING_QUERY = `*[ _type == "frontPage" && ${FILTER_NON_DRAFTS}]{
  pieces[] -> {
    ${pieceProjection}
  }
}[0]`;

const getLanding = (): Promise<{ pieces: ResolvedPiece[] }> => sanityClient.fetch(LANDING_QUERY);

export default getLanding;
