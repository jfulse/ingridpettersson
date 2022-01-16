import { FILTER_NON_DRAFTS } from "../../constants";
import { sanityClient } from "../utils/sanityClient";

const SHIPPING_INFO_QUERY = `*[ _type == 'shop' && ${FILTER_NON_DRAFTS}][0]{ shippingInfo }`;

const getShippingInfo = (): Promise<{ shippingInfo: string | null }> => sanityClient.fetch(SHIPPING_INFO_QUERY);

export default getShippingInfo;
