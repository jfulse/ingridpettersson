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

type Props = { href: string; children: ReactNode; exact?: boolean; className?: string };

const Link = ({ href, children, exact, className }: Props) => {
  const { asPath } = useRouter();
  const isActive = exact ? asPath === href : asPath.startsWith(href);

  return (
    <Wrapper isActive={isActive} className={className}>
      <NextLink href={href}>{children}</NextLink>
    </Wrapper>
  );
};

export default Link;
