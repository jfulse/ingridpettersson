import styled from "styled-components";

import { EMPTY_ARRAY } from "../constants";
import slugify from "../utils/slugify";
import getApiUrl from "../utils/getApiUrl";
import makeGetServerSideProps, { Props } from "../utils/makeGetServerSideProps";
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

  // Making dropdown goes above images also during the transformation:
  position: relative;
  z-index: 1;

  span:last-child {
    margin-right: 1rem;
  }
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

const getProjectsApiUrl = () => `${getApiUrl()}/api/projects`;

export const getServerSideProps = makeGetServerSideProps(getProjectsApiUrl);

const Header = (props: Props<ResolvedProject[]>) => {
  const { data } = useData(getProjectsApiUrl());
  const projects = (data || props.data) ?? EMPTY_ARRAY;

  const isMobile = useIsMobile();
  const headerMenuItems = useMemo(() => getHeaderMenuItems(projects), [projects]);

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

          return <DropdownMenu key={title} items={menuItems} component={Component} />;
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
