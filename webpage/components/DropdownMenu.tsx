import { ComponentType, useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useClickAway } from "react-use";

import { MenuItem as MenuItemType } from "../types";

import MaybeLink from "./MaybeLink";
import MenuItem from "./MenuItem";
import { getColors } from "../style/theme";

// TODO: Fix click area in sub dropdown

const Wrapper = styled.div`
  position: relative;
`;

const Menu = styled.ul<{ open: boolean }>`
  list-style: none;
  position: absolute;
  right: 0;
  margin: 0.5rem 0 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => getColors(props, "line")};
  font-size: 1rem;
  border-radius: 0.5rem;
  transform-origin: top;
  transform: scaleY(0);
  transition: transform 0.26s ease;
  background-color: ${(props) => getColors(props, "background")};
  z-index: 10;
  box-shadow: -0.25rem 0.5rem 1rem rgba(0, 0, 0, 0.2);

  ${({ open }) => open && "transform: scaleY(1);"}

  li:first-child {
    border-radius: 0.5rem 0.5rem 0 0;
  }

  li:last-child {
    border-radius: 0 0 0.5rem 0.5rem;
  }
`;

type Props = {
  items: MenuItemType[];
  component: ComponentType<{ onClick?: () => void }>;
};

const hasSubmenu = (menuItems?: MenuItemType[]) => menuItems && menuItems.length > 0;

const HamburgerMenu = ({ items, component: Component }: Props) => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((current) => !current), []);
  const close = useCallback(() => setIsOpen(false), []);

  useClickAway(ref, close);

  return (
    <Wrapper ref={ref}>
      <Component onClick={toggle} />
      <Menu open={isOpen}>
        {items
          .filter(({ hidden }) => !hidden)
          .map(({ title, href, onClick, menuItems }) => (
            <MenuItem key={title} onClick={onClick} toggle={toggle} group={hasSubmenu(menuItems)}>
              {hasSubmenu(menuItems) ? (
                <div>
                  {title}
                  {menuItems?.map?.((subMenuItem) => (
                    <MaybeLink key={subMenuItem.title} href={subMenuItem.href}>
                      <MenuItem>{subMenuItem.title}</MenuItem>
                    </MaybeLink>
                  ))}
                </div>
              ) : (
                <MaybeLink href={href}>{title}</MaybeLink>
              )}
            </MenuItem>
          ))}
      </Menu>
    </Wrapper>
  );
};

export default HamburgerMenu;
