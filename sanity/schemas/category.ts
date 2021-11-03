import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";

import field from "../utils/field";

export default {
  name: "category",
  title: "Categories",
  type: "document",
  icon: GiPerspectiveDiceSixFacesRandom,
  fields: [field("title")],
  preview: {
    select: {
      title: "title",
    },
  },
};
