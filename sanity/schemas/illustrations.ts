import { MdWeb } from "react-icons/md";

import field from "../utils/field";

export default {
  name: "illustrations",
  title: "Illustration",
  type: "document",
  icon: MdWeb,
  __experimental_actions: ["update", "publish"],
  fields: [
    field("pieces", {
      type: "array",
      required: true,
      of: [
        {
          type: "reference",
          to: [{ type: "piece" }],
          options: { filter: `_type == "piece" && category->title == "Illustration"` },
        },
      ],
      description: "The illustrations shown on the illustration page, in the order below",
    }),
  ],
};
