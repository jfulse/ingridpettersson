import { FieldConfig, RuleType } from "../types";
import capitalize from "./capitalize";

export default (name: string, { title, type, required, validation, ...rest }: FieldConfig = {}): FieldConfig => ({
  name,
  type: type || "string",
  validation: validation || (required ? (Rule: RuleType) => Rule.required() : undefined),
  title: title || capitalize(name),
  ...rest,
});
