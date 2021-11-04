import NextLink from "next/link";
import { ReactNode } from "react";

import styled from "styled-components";

const Wrapper = styled.span`
  a {
    color: initial;
    text-decoration: none;
  }
`;

type Props = { href: string; children: ReactNode };

const Link = ({ href, children }: Props) => (
  <Wrapper>
    <NextLink href={href}>{children}</NextLink>
  </Wrapper>
);

export default Link;
