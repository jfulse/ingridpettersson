import createSchema from "part:@sanity/base/schema-creator";
import schemaTypes from "all:part:@sanity/base/schema-type";

import bio from "./bio";
import category from "./category";
import frontPage from "./frontPage";
import piece from "./piece";
import project from "./project";
import price from "./price";
import shop from "./shop";
import youtubeEmbed from "./youtubeEmbed";

export default createSchema({
  name: "default",
  types: schemaTypes.concat([
    bio,
    piece,
    category,
    frontPage,
    project,
    price,
    shop,
    youtubeEmbed,
  ]),
});
