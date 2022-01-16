import { MouseEventHandler, ReactNode } from "react";
import styled from "styled-components";

import { getColors } from "../style/theme";
import MaybeLink from "./MaybeLink";

const StyledMaybeLink = styled(MaybeLink)<{
  group?: boolean;
  submenuItem?: boolean;
  role: string;
  onClick?: MouseEventHandler;
}>`
  display: block;
  white-space: nowrap;
  font-weight: normal;
  padding: 0;
  margin: 0;

  a {
    display: block;
    padding: 0.5rem 1.5rem;
    cursor: pointer;
  }

  &:first-child a {
    padding-top: 1rem;
  }

  &:last-child a {
    padding-bottom: 1rem;
  }

  ${({ submenuItem }) => submenuItem && `font-style: italic`};

  ${({ group }) =>
    group &&
    `
    a {
      padding-bottom: 0;
      
      & + li {
        padding-top: 0;
      }
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
  href?: string;
  children: ReactNode;
  group?: boolean;
  submenuItem?: boolean;
  onClick?: MouseEventHandler;
};

const MenuItem = ({ href, children, group, submenuItem, onClick }: Props) => {
  return (
    <StyledMaybeLink href={href} group={group} submenuItem={submenuItem} onClick={onClick} role="listitem">
      {children}
    </StyledMaybeLink>
  );
};

export default MenuItem;
