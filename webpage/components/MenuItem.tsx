import { ReactNode, useCallback } from "react";
import styled from "styled-components";

import { getColors } from "../style/theme";

const StyledMenuItem = styled.li<{ group?: boolean }>`
  list-style: none;
  white-space: nowrap;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: normal;

  &:first-child {
    padding-top: 1rem;
  }

  &:last-child {
    padding-bottom: 1rem;
  }

  ${({ group }) =>
    group &&
    `
    font-weight: bold;
    padding-bottom: 0;
    
    & + li {
      padding-top: 0;
    }
  `}

  &:hover {
    ${(props) =>
      `background-color: ${getColors(props, "backgroundEmphasized")};`}
  }
`;

type Props = {
  toggle?: () => void;
  onClick?: () => void;
  children: ReactNode;
  group?: boolean;
};

const MenuItem = ({ toggle, onClick, children, group }: Props) => {
  const handleClick = useCallback(() => {
    toggle?.();
    onClick?.();
  }, [onClick, toggle]);

  return (
    <StyledMenuItem group={group} onClick={handleClick}>
      {children}
    </StyledMenuItem>
  );
};

export default MenuItem;
