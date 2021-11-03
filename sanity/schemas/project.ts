import { GrProjects } from "react-icons/gr";

import field from "../utils/field";

export default {
  name: "project",
  title: "Projects",
  type: "document",
  icon: GrProjects,
  fields: [
    field("title"),
    field("year", { type: "number" }),
    field("images", {
      type: "array",
      of: [
        { type: "image", fields: [field("title")] },
        { type: "youtubeEmbed" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "year",
    },
  },
};
