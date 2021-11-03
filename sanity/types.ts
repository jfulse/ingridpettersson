import { SanityDocument } from "@sanity/client";

export type DocumentType =
  | "bio"
  | "category"
  | "frontPage"
  | "piece"
  | "project"
  | "shop";

export type Rule = { required?: () => Rule };

export type FieldConfig = {
  name?: string;
  title?: string;
  type?: SchemaType;
  required?: boolean;
  validation?: (rule: Rule) => Rule;
  of?: FieldConfig[];
  description?: string;
  fields?: FieldConfig[];
  to?: FieldConfig[];
  options?: { filter: string };
  initialValue?: any;
  hidden?: boolean | (({ document }: { document: SanityDocument }) => boolean);
};

export type SchemaType =
  | "array"
  | "reference"
  | "image"
  | "string"
  | "number"
  | "boolean"
  | "price"
  | "text"
  | "object"
  | "youtubeEmbed"
  | DocumentType;
