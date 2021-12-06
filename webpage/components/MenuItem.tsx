import { MouseEventHandler, ReactNode, useCallback } from "react";
import styled from "styled-components";

import { getColors } from "../style/theme";

const StyledMenuItem = styled.li<{ group?: boolean; submenuItem?: boolean }>`
  list-style: none;
  white-space: nowrap;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  font-weight: normal;

  &:first-child {
    padding-top: 1rem;
  }

  &:last-child {
    padding-bottom: 1rem;
  }

  ${({ submenuItem }) => submenuItem && `font-style: italic`};

  ${({ group }) =>
    group &&
    `
    padding-bottom: 0;
    
    & + li {
      padding-top: 0;
    }
  `}

  &:hover {
    ${(props) => `background-color: ${getColors(props, "backgroundEmphasized")};`}

    @media only screen and (max-width: 480px) {
      background-color: unset;
    }
  }
`;

type Props = {
  toggle?: () => void;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  group?: boolean;
  submenuItem?: boolean;
};

const MenuItem = ({ toggle, onClick, children, group, submenuItem }: Props) => {
  const handleClick = useCallback(
    (event) => {
      toggle?.();
      onClick?.(event);
    },
    [onClick, toggle]
  );

  return (
    <StyledMenuItem group={group} onClick={handleClick} submenuItem={submenuItem}>
      {children}
    </StyledMenuItem>
  );
};

export default MenuItem;
