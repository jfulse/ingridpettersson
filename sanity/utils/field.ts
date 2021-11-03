import { FieldConfig, SchemaType, Rule } from "../types";
import capitalize from "./capitalize";

export default (
  name: string,
  { title, type, required, validation, ...rest }: FieldConfig = {}
): FieldConfig => ({
  name,
  type: type || "string",
  validation: validation || (required ? (Rule) => Rule.required() : undefined),
  title: title || capitalize(name),
  ...rest,
});
