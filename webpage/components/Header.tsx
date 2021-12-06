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

export const HEADER_HEIGHT = "4rem";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  height: ${HEADER_HEIGHT};
  background-color: ${(props) => getColors(props, "background")};

  // Make sure dropdown goes above image hover title
  z-index: 10;

  span:last-child {
    margin-right: 1rem;
  }
`;

const Name = styled.h1`
  margin: 0;
  padding: 1rem 1rem 1rem 1.5rem;
  font-size: 1.2rem;
  cursor: pointer;
`;

const MenuButton = styled.button`
  background: none;
  cursor: pointer;
  border: none;
`;

const MaybeHidden = styled.div<{ hide?: boolean }>`
  transition: transform 0.26s ease; /* TODO: transition doesn't work */
  ${({ hide }) => hide && "transform: scaleX(0);"}
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
  { title: `checkout${nItems > 0 ? ` (${nItems})` : ""}`, href: "/checkout", hidden: nItems === 0 },
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
      {headerMenuItems.map(({ title, href, menuItems, hidden }) => {
        if (menuItems && menuItems.length > 0) {
          const Component = ({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> }) => (
            <MenuButton onClick={onClick}>{title}</MenuButton>
          );

          return <DropdownMenu key={title} items={menuItems} component={Component} />;
        }

        return (
          <MaybeHidden key={title} hide={hidden}>
            <MaybeLink href={href}>{title}</MaybeLink>
          </MaybeHidden>
        );
      })}
    </Wrapper>
  );
};

export default Header;
