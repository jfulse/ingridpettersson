import { ComponentType, useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useClickAway } from "react-use";

import { MenuItem as MenuItemType } from "../types";

import MaybeLink from "./MaybeLink";
import MenuItem from "./MenuItem";
import { getColors } from "../style/theme";

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

const hasSubmenu = (menuItems?: MenuItemType[]) =>
  menuItems && menuItems.length > 0;

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
        {items.map(({ title, href, onClick, menuItems }) => (
          <MenuItem
            key={title}
            onClick={onClick}
            toggle={toggle}
            group={hasSubmenu(menuItems)}
          >
            {hasSubmenu(menuItems) ? (
              <div>
                {title}
                {menuItems?.map?.((subMenuItem) => (
                  <MenuItem
                    key={subMenuItem.title}
                    onClick={subMenuItem.onClick}
                  >
                    <MaybeLink href={subMenuItem.href}>
                      {subMenuItem.title}
                    </MaybeLink>
                  </MenuItem>
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
