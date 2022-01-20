import NextLink from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { MouseEventHandler, ReactNode } from "react";

import { hoverButton } from "../style/utils";
import { getColors } from "../style/theme";

const Wrapper = styled.span<{ isActive: boolean }>`
  a {
    color: ${(props) => getColors(props, "dark")};
    text-decoration: none;
    padding: 0.25rem 0.4rem;
    border-radius: 0.25rem;
    ${hoverButton}

    ${({ isActive, ...props }) =>
      isActive &&
      `
      color: ${getColors(props, "bright")};
      background-color: ${getColors(props, "dark")};

      @media only screen and (max-width: 480px) {
        color: ${getColors(props, "dark")};
        background-color: transparent;
        font-weight: bold;
      }
    `}
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
