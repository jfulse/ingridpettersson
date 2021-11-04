import { ReactNode, useCallback } from "react";
import styled from "styled-components";

const StyledMenuItem = styled.li`
  list-style: none;
  white-space: nowrap;
`;

type Props = { toggle: () => void; onClick?: () => void; children: ReactNode };

const MenuItem = ({ toggle, onClick, children }: Props) => {
  const handleClick = useCallback(() => {
    toggle();
    onClick?.();
  }, [onClick, toggle]);

  return <StyledMenuItem onClick={handleClick}>{children}</StyledMenuItem>;
};

export default MenuItem;
