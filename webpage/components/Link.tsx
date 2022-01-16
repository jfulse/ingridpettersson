import NextLink from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { MouseEventHandler, ReactNode } from "react";

import { hoverButton } from "../style/utils";
import { getColors } from "../style/theme";

const Wrapper = styled.span<{ isActive: boolean }>`
  a {
    color: ${({ isActive, ...props }) => (isActive ? getColors(props, "selected") : getColors(props, "dark"))};
    text-decoration: none;
    ${hoverButton}
  }
`;

type Props = { href: string; children: ReactNode; exact?: boolean; className?: string; onClick?: MouseEventHandler };

const Link = ({ href, children, exact, className, onClick }: Props) => {
  const { asPath } = useRouter();
  const isActive = exact ? asPath === href : asPath.startsWith(href);

  return (
    <Wrapper isActive={isActive} className={className} onClick={onClick}>
      <NextLink href={href}>{children}</NextLink>
    </Wrapper>
  );
};

export default Link;
