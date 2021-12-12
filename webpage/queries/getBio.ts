import { FILTER_NON_DRAFTS } from "../../constants";
import { ResolvedBio } from "../types";
import { sanityClient } from "../utils/sanityClient";

const BIO_QUERY = `*[ _type == "bio" && ${FILTER_NON_DRAFTS} ]{
  headline,
  body,
  image { asset -> }
}[0]`;

const getBio = (): Promise<ResolvedBio> => sanityClient.fetch(BIO_QUERY);

export default getBio;
