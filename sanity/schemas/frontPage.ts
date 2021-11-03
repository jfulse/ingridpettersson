import { MdWeb } from "react-icons/md";

import field from "../utils/field";

export default {
  name: "frontPage",
  title: "Front Page",
  type: "document",
  icon: MdWeb,
  __experimental_actions: ["update", "publish"],
  fields: [
    field("pieces", {
      type: "array",
      required: true,
      of: [{ type: "reference", to: [{ type: "piece" }] }],
      description: "The pieces shown on the front page, in the order below",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Front page" }),
  },
};
