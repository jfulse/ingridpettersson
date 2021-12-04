import { FILTER_NON_DRAFTS } from "../../constants";
import { sanityClient } from "../utils/sanityClient";

const PIECE_IDS_QUERY = `*[ _type == "piece" && ${FILTER_NON_DRAFTS} ][]._id`;

const getPieceIds = (): Promise<string[]> => sanityClient.fetch(PIECE_IDS_QUERY);

export default getPieceIds;
