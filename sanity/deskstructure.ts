import S from "@sanity/desk-tool/structure-builder";
import { MdWeb } from "react-icons/md";
import { GiSecretBook } from "react-icons/gi";
import { RiShoppingCart2Line } from "react-icons/ri";
import { BsImage } from "react-icons/bs";

import client from "./utils/client";

const singletonListItem = (schemaType, title, icon) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(async () => {
      const query = `*[ _type == $schemaType && !(_id in path('drafts.**')) ][0]._id`;
      const params = { schemaType };
      const documentId = await client.fetch(query, params);

      return S.document().id(schemaType).schemaType(schemaType).title(title).documentId(documentId);
    });

export default () =>
  S.list()
    .title("Content")
    .items([
      ...S.documentTypeListItems().filter(
        (listItem) => !["frontPage", "shop", "bio", "illustrations"].includes(listItem.getId())
      ),
      S.divider(),
      singletonListItem("frontPage", "Front page", MdWeb),
      singletonListItem("shop", "Shop", RiShoppingCart2Line),
      singletonListItem("illustrations", "Illustrations", BsImage),
      singletonListItem("bio", "Bio", GiSecretBook),
    ]);
