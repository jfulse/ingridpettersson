import { ReactNode, MouseEventHandler } from "react";
import styled from "styled-components";

import { hoverButton } from "../style/utils";
import { getColors } from "../style/theme";

const StyledNavButton = styled.button<{ right?: boolean }>`
  position: absolute;
  height: 100%;
  z-index: 1;
  cursor: pointer;
  background: none;
  border: none;
  padding: 1rem;
  width: 4rem;
  ${hoverButton}
  transition: opacity 0.3s ease-in, background-color 0.3s ease-in;

  ${({ right }) => right && "right: 0;"}

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    transition: opacity 0.3s ease-out, background-color 0.3s ease-out;

    @media only screen and (max-width: 480px) {
      background-color: unset;
    }
  }

  &:disabled {
    cursor: default;
  }

  svg {
    height: 100%;
    width: 100%;
    border: ${(props) => `1px solid ${getColors(props, "bright")}`};
    background-color: ${(props) => getColors(props, "bright")};
  }
`;

type NavButtonProps = {
  onClick: MouseEventHandler<HTMLElement>;
  disabled: boolean;
  children: ReactNode;
  right?: boolean;
};

const NavButton = ({ onClick, disabled, children, right }: NavButtonProps) => (
  <StyledNavButton onClick={onClick} disabled={disabled} right={right}>
    <div>{children}</div>
  </StyledNavButton>
);

export default NavButton;
