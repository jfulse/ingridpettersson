import { ComponentType, MouseEventHandler, useCallback, useRef, useState } from "react";
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
  font-size: 1rem;
  border-radius: 0.5rem;
  transform-origin: top;
  transform: scaleY(0);
  transition: transform 0.26s ease;
  background-color: ${(props) => getColors(props, "background")};
  z-index: 10;
  box-shadow: -0.25rem 0.5rem 1rem rgba(0, 0, 0, 0.2);

  ${({ open }) => open && "transform: scaleY(1);"}
`;

const SubMenu = styled.div`
  padding: 0 1.5rem;

  span a {
    padding: 0.5rem 1rem;
  }

  span:last-child a {
    padding: 0.5rem 1rem;
  }
`;

type Props = {
  items: MenuItemType[];
  component: ComponentType<{ onClick?: MouseEventHandler<HTMLButtonElement> }>;
};

const hasSubmenu = (menuItems?: MenuItemType[]) => menuItems && menuItems.length > 0;

const DropdownMenu = ({ items, component: Component }: Props) => {
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
          .map(({ title, href, menuItems }) => (
            <MenuItem key={title} href={href} group={hasSubmenu(menuItems)} onClick={close}>
              {hasSubmenu(menuItems) ? (
                <SubMenu>
                  {title}
                  {menuItems?.map?.((subMenuItem) => (
                    <MenuItem key={subMenuItem.title} href={subMenuItem.href} submenuItem>
                      {subMenuItem.title}
                    </MenuItem>
                  ))}
                </SubMenu>
              ) : (
                title
              )}
            </MenuItem>
          ))}
      </Menu>
    </Wrapper>
  );
};

export default DropdownMenu;
