import { ReactNode, useCallback } from "react";
import styled from "styled-components";

const StyledMenuItem = styled.li<{ group?: boolean }>`
  list-style: none;
  white-space: nowrap;
  ${({ group }) => group && "font-weight: bold"};
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
