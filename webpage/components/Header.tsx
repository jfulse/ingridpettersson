import { MouseEventHandler, useMemo } from "react";
import styled from "styled-components";

import { getColors } from "../style/theme";
import slugify from "../utils/slugify";
import useIsMobile from "../hooks/useIsMobile";
import HamburgerMenu from "./HamburgerMenu";
import Link from "./Link";
import MaybeLink from "./MaybeLink";
import DropdownMenu from "./DropdownMenu";
import { MenuItem, ResolvedProject } from "../types";
import useShoppingCart from "../hooks/useShoppingCart";

export const HEADER_HEIGHT_REM = 4;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  height: ${HEADER_HEIGHT_REM}rem;
  background-color: ${(props) => getColors(props, "background")};
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;

  // Make sure dropdown goes above image hover title
  z-index: 10;

  span:last-child {
    margin-right: 1.5rem;
  }
`;

const Name = styled.h1`
  margin: 0;
  padding: 1rem 1rem 1rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
`;

const MenuButton = styled.button`
  background: none;
  cursor: pointer;
  border: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
`;

const getHeaderMenuItems = (projects: ResolvedProject[], nItems: number): MenuItem[] => [
  { title: "shop", href: "/shop" },
  {
    title: "projects",
    menuItems: projects.map(({ title, year }) => ({
      title: `${title} (${year})`,
      href: `/projects/${slugify(title)}`,
    })),
  },
  { title: "illustration", href: "/illustration" },
  { title: "bio", href: "/bio" },
  { title: `checkout${nItems > 0 ? ` (${nItems})` : ""}`, href: "/checkout" },
];

type Props = { projects: ResolvedProject[] };

const Header = ({ projects }: Props) => {
  const { nItems } = useShoppingCart();

  const isMobile = useIsMobile();
  const headerMenuItems = useMemo(() => getHeaderMenuItems(projects, nItems), [nItems, projects]);

  if (isMobile) {
    return (
      <Wrapper>
        <Link href="/">
          <Name>Ingrid Pettersson</Name>
        </Link>
        <HamburgerMenu items={headerMenuItems} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Link href="/">
        <Name>Ingrid Pettersson</Name>
      </Link>
      {headerMenuItems.map(({ title, href, menuItems }) => {
        if (menuItems && menuItems.length > 0) {
          const Component = ({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> }) => (
            <MenuButton onClick={onClick}>{title}</MenuButton>
          );

          return <DropdownMenu key={title} items={menuItems} component={Component} />;
        }

        return (
          <div key={title}>
            <MaybeLink href={href}>{title}</MaybeLink>
          </div>
        );
      })}
    </Wrapper>
  );
};

export default Header;
