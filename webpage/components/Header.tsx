import { NextPage } from "next";
import styled from "styled-components";

import useIsMobile from "../hooks/useIsMobile";
import HamburgerMenu from "./HamburgerMenu";
import Link from "./Link";

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

const menuItems = [
  { title: "shop", href: "/shop" },
  { title: "projects", href: "/projects" },
  { title: "illustration", href: "/illustration" },
  { title: "bio", href: "/bio" },
  { title: "checkout", href: "/checkout" },
];

const Header: NextPage = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Wrapper>
        <Link href="/">
          <Name>Ingrid Pettersson</Name>
        </Link>
        <HamburgerMenu items={menuItems} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Link href="/">
        <Name>Ingrid Pettersson</Name>
      </Link>
      {menuItems.map(({ title, href }) => (
        <Link key={title} href={href}>
          {title}
        </Link>
      ))}
    </Wrapper>
  );
};

export default Header;
