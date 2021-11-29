import PropTypes from "prop-types";
import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import styled from "styled-components";

import camelToName from "../utils/camelToName";

const StyledInput = styled.input`
  border-style: solid;
  margin-left: 1rem;
`;

type Props = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
};

const Input = ({ label, value, onChange, type = "text" }: Props) => {
  const inputId = `checkout-input-${label}`;

  return (
    <>
      <label htmlFor={inputId}>{camelToName(label)}</label>
      <StyledInput id={inputId} name={label} value={value} onChange={onChange} type={type} />
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
