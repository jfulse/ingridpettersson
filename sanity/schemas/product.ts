import { BsGiftFill } from "react-icons/bs";

import { RuleType } from "../types";
import client from "../utils/client";

import field from "../utils/field";
import getDocumentId from "../utils/getDocumentId";

export default {
  name: "product",
  title: "Products",
  type: "document",
  icon: BsGiftFill,
  fields: [
    field("piece", {
      type: "reference",
      to: [{ type: "piece" }],
      options: { filter: `_type == 'piece'` },
      validation: (Rule: RuleType) => [
        Rule.required(),
        Rule.custom(async (field, meta) => {
          const productId = getDocumentId(meta.document);
          const draftProductId = `drafts.${productId}`;

          const otherProducts = await client.fetch(
            `*[ _type == 'product' && _id != $productId && _id != $draftProductId]`,
            { productId, draftProductId }
          );

          if (otherProducts.find(({ piece }) => piece?._ref === field._ref)) {
            return "There already exists a product with this piece";
          }

          return true;
        }),
      ],
    }),
    field("price", { type: "number", required: true }),
    field("stock", { type: "number", required: true }),
  ],
  preview: {
    select: {
      title: "piece.title",
      price: "price",
      stock: "stock",
      image: "piece.images.0",
    },
    prepare: ({ title, price, image, stock }) => ({
      title,
      subtitle: `${price} NOK, stock: ${stock}`,
      media: image,
    }),
  },
};
