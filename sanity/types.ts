import { SanityDocument } from "@sanity/client";

export type DocumentType = "bio" | "category" | "frontPage" | "piece" | "product" | "project" | "shop";

export type FieldConfig = {
  name?: string;
  title?: string;
  type?: SchemaType;
  required?: boolean;
  validation?: (rule: RuleType) => RuleType | RuleType[];
  of?: FieldConfig[];
  description?: string;
  fields?: FieldConfig[];
  to?: FieldConfig[];
  options?: { filter: string };
  initialValue?: any;
  hidden?: boolean | (({ document }: { document: SanityDocument }) => boolean);
  filter?: string;
  rows?: number;
};

export type SchemaType =
  | "array"
  | "block"
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

export type CustomRuleCallback = (field: any, meta: any) => true | string | Error | Promise<true | string | Error>;

export type RuleType = {
  required: () => RuleType;
  custom: (cb: CustomRuleCallback) => RuleType;
  min: (min: number) => RuleType;
  max: (max: number) => RuleType;
  length: (exactLength: number) => RuleType;
  greaterThan: (gt: number) => RuleType;
  uri: (options: { scheme: string[] }) => RuleType;
  integer: () => RuleType;
  precision: (limit: number) => RuleType;
  error: (message: string) => RuleType;
  regex: (regex: RegExp) => RuleType;
};
