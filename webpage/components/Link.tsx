import NextLink from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { getColors } from "../style/theme";

const Wrapper = styled.span<{ isActive: boolean }>`
  a {
    /* TODO: Active color */
    color: ${({ isActive, ...props }) => (isActive ? getColors(props, "selected") : "initial")};
    text-decoration: none;
  }
`;

type Props = { href: string; children: ReactNode; exact?: boolean };

const Link = ({ href, children, exact }: Props) => {
  const { pathname } = useRouter();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Wrapper isActive={isActive}>
      <NextLink href={href}>{children}</NextLink>
    </Wrapper>
  );
};

export default Link;
