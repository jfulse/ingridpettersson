import { HTMLInputTypeAttribute } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
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
  errors: { [name: string]: FieldError | undefined };
  isSubmitted: boolean;
  type?: HTMLInputTypeAttribute;
  onClick?: () => void;
  register: UseFormRegister<AddressType>;
};

const getValidator = (type: HTMLInputTypeAttribute): ((value?: string) => boolean) | undefined => {
  switch (type) {
    case "email":
      return isEmail;
    case "number":
      return isNumber;
  }
};

const Input = ({ name, register, errors, isSubmitted, readOnly, onClick, required = true, type = "text" }: Props) => {
  const inputId = `checkout-input-${name}`;
  const hasError = isSubmitted && Boolean(errors?.[name]);

  const {
    name: fieldName,
    onBlur,
    onChange,
    ref,
  } = register(name, {
    required,
    validate: getValidator(type),
  });

  return (
    <>
      <label htmlFor={inputId}>{camelToName(name)}</label>
      <StyledInput
        id={inputId}
        name={fieldName}
        onChange={onChange}
        type={type}
        onBlur={onBlur}
        readOnly={readOnly}
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
