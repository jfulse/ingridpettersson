import { FILTER_NON_DRAFTS } from "../../constants";
import { sanityClient } from "../utils/sanityClient";

const EMAIL_QUERY = `*[ _type == "bio" && ${FILTER_NON_DRAFTS}][0].email`;

const getEmail = (): Promise<string> => sanityClient.fetch(EMAIL_QUERY);

export default getEmail;
