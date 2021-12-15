import PropTypes from "prop-types";
import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import styled from "styled-components";

import camelToName from "../utils/camelToName";

const noop = () => null;

const StyledInput = styled.input`
  border-style: solid;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;

type Props = {
  label: string;
  value: string;
  noChange?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  type?: HTMLInputTypeAttribute;
};

const Input = ({ label, value, onChange, onClick, noChange, type = "text" }: Props) => {
  const inputId = `checkout-input-${label}`;

  return (
    <>
      <label htmlFor={inputId}>{camelToName(label)}</label>
      <StyledInput
        id={inputId}
        name={label}
        value={value}
        onChange={noChange ? noop : onChange}
        type={type}
        onClick={onClick}
        readOnly={noChange}
      />
    </>
  );
};

Input.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["email", "number", "text"]).isRequired,
};

export default Input;
