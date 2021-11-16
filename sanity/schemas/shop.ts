import { RiShoppingCart2Line } from "react-icons/ri";

import field from "../utils/field";

export default {
  name: "shop",
  title: "Shop",
  type: "document",
  icon: RiShoppingCart2Line,
  __experimental_actions: ["update", "publish"],
  fields: [
    field("products", {
      type: "array",
      required: true,
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
      description: "The products shown in the shop, in the order below.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Shop" }),
  },
};
