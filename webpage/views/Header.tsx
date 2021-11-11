import { NextPage } from "next";
import styled from "styled-components";

import slugify from "../utils/slugify";
import useIsMobile from "../hooks/useIsMobile";
import useData from "../hooks/useData";
import HamburgerMenu from "../components/HamburgerMenu";
import Link from "../components/Link";
import MaybeLink from "../components/MaybeLink";
import DropdownMenu from "../components/DropdownMenu";
import { MenuItem, ResolvedProject } from "../types";
import { useMemo } from "react";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.h1`
  margin: 0;
  padding: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
`;

const MenuButton = styled.button`
  background: none;
  cursor: pointer;
  border: none;
`;

const getHeaderMenuItems = (projects: ResolvedProject[]): MenuItem[] => [
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
  { title: "checkout", href: "/checkout" },
];

const Header: NextPage = () => {
  const isMobile = useIsMobile();
  const { data: projects = [], loading, error } = useData("api/projects");
  const headerMenuItems = useMemo(
    () => getHeaderMenuItems(projects),
    [projects]
  );
  // TODO: loading and error

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
          const Component = ({ onClick }: { onClick?: () => void }) => (
            <MenuButton onClick={onClick}>{title}</MenuButton>
          );
          return <DropdownMenu items={menuItems} component={Component} />;
        }

        return (
          <MaybeLink key={title} href={href}>
            {title}
          </MaybeLink>
        );
      })}
    </Wrapper>
  );
};

export default Header;
