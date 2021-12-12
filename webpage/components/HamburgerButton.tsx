import { MouseEventHandler } from "react";
import styled from "styled-components";

const Button = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: none;
  background: none;
  padding: 1rem 1.5rem 1rem 0;
  height: 3rem;
  width: 3.5rem;

  div {
    background-color: black;
    height: 2px;
    width: 100%;
  }
`;

const HamburgerButton = ({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> }) => (
  <Button onClick={onClick}>
    <div />
    <div />
    <div />
  </Button>
);

export default HamburgerButton;
