import slugify from "slugify";

const slugifyFn = (text?: string): string =>
  text ? slugify(text, { lower: true, locale: "nb" }) : "";

export default slugifyFn;
