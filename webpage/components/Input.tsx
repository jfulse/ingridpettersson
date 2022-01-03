import { HTMLInputTypeAttribute } from "react";
import { Control, useController } from "react-hook-form";
import styled from "styled-components";
// @ts-ignore
import isEmail from "is-email";

import { Address as AddressType } from "../types";
import camelToName from "../utils/camelToName";

const isNumber = (text: string | undefined) => Boolean(text && text.match(/[\d]+/));

const StyledInput = styled.input<{ hasError: boolean }>`
  border-style: solid;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;

  ${({ hasError }) => hasError && "border-color: #ee5b14;"}
`;

type Props = {
  name: keyof AddressType;
  readOnly?: boolean;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  onClick?: () => void;
  control: Control<AddressType, object>;
};

const getValidator = (type: HTMLInputTypeAttribute): ((value?: string) => boolean) | undefined => {
  switch (type) {
    case "email":
      return isEmail;
    case "number":
      return isNumber;
  }
};

const Input = ({ name, control, readOnly, onClick, required = true, type = "text" }: Props) => {
  const inputId = `checkout-input-${name}`;

  const {
    field: { onChange, onBlur, name: fieldName, value, ref },
    fieldState: { invalid },
    formState: { isSubmitted, isSubmitting },
  } = useController({
    name,
    control,
    rules: { required, validate: getValidator(type) },
  });

  const hasError = isSubmitted && invalid;

  return (
    <>
      <label htmlFor={inputId}>{camelToName(name)}</label>
      <StyledInput
        id={inputId}
        value={value}
        name={fieldName}
        onChange={onChange}
        type={type}
        onBlur={onBlur}
        readOnly={readOnly || isSubmitting}
        hasError={hasError}
        onClick={onClick}
        ref={ref}
        aria-required={required}
        aria-invalid={hasError ? "true" : "false"}
      />
    </>
  );
};

export default Input;
