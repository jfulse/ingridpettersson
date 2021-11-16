import { SanityDocument } from "@sanity/client";

export default (document?: SanityDocument) =>
  document?._id?.replace?.(/^drafts./, "");
