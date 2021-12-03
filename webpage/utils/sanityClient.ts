import { ClientConfig, createClient, createImageUrlBuilder } from "next-sanity";

import isServer from "./isServer";

const dataset = process.env.SANITY_STUDIO_API_DATASET ?? "production";

if (isServer()) {
  if (!dataset) console.error("💾 No dataset");
  else console.log(`💾 Current dataset: ${dataset}`);
}

export const sanityConfig: ClientConfig = {
  dataset,
  projectId: "js8cabp8",
  apiVersion: "2021-11-11",
  useCdn: process.env.NODE_ENV === "production",
};

export const imageUrlBuilder = (source: any) => createImageUrlBuilder(sanityConfig).image(source);

export const sanityClient = createClient(sanityConfig);
