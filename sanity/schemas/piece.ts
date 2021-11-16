import { BsCardImage } from "react-icons/bs";

import field from "../utils/field";

// TODO: Hardcode categories? Then we can hide fields

const notForSale = ({ document }) => !document.forSale;

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
    field("description"),
    field("colour"),
    field("material"),
    field("care"),
    field("size"),
    field("project", { type: "reference", to: [{ type: "project" }] }),
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
