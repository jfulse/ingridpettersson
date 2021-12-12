import { BsCardImage } from "react-icons/bs";

import field from "../utils/field";

export default {
  name: "piece",
  title: "Pieces",
  type: "document",
  icon: BsCardImage,
  fields: [
    field("title"),
    field("category", {
      type: "reference",
      to: [{ type: "category" }],
      required: true,
    }),
    field("description", { type: "array", of: [{ type: "block" }] }),
    field("images", {
      type: "array",
      of: [{ type: "image", fields: [field("title")] }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
      media: "images.0",
    },
  },
};
