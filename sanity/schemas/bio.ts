import { GiSecretBook } from "react-icons/gi";

import field from "../utils/field";

export default {
  name: "bio",
  title: "Bio",
  type: "document",
  icon: GiSecretBook,
  __experimental_actions: ["update", "publish"],
  fields: [
    field("email", { type: "string" }),
    field("headline", { type: "text" }),
    field("body", { type: "text" }),
    field("image", { type: "image", fields: [field("title")] }),
  ],
  preview: {
    select: { title: "headline", media: "image" },
  },
};
