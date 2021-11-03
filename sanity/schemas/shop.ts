import { RiShoppingCart2Line } from "react-icons/ri";

import field from "../utils/field";

export default {
  name: "shop",
  title: "Shop",
  type: "document",
  icon: RiShoppingCart2Line,
  __experimental_actions: ["update", "publish"],
  fields: [
    field("pieces", {
      type: "array",
      required: true,
      of: [
        {
          type: "reference",
          to: [{ type: "piece" }],
          options: { filter: `_type == 'piece' && forSale` },
        },
      ],
      description:
        "The pieces shown in the shop, in the order below. Only the ones for sale are eligible",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Shop" }),
  },
};
