import { FILTER_NON_DRAFTS } from "../../constants";
import { ResolvedProduct } from "../types";
import { sanityClient } from "../utils/sanityClient";
import { pieceProjection } from "../utils/queries";

const SHOP_QUERY = `*[ _type == "shop" && ${FILTER_NON_DRAFTS} ]{
  products[] -> {
    _id,
    price,
    stock,
    reserved,
    "piece": piece -> {
      ${pieceProjection}
    }
  }
}[0]`;

const getShop = (): Promise<{ products: ResolvedProduct[] }> => sanityClient.fetch(SHOP_QUERY);

export default getShop;
