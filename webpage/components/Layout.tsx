import { ReactNode } from "react";
import styled from "styled-components";

import { ResolvedProject } from "../types";
import Header, { HEADER_HEIGHT_REM } from "./Header";
import Footer, { FOOTER_HEIGHT_REM } from "./Footer";
import useIsMobile from "../hooks/useIsMobile";

const Content = styled.div<{ footerAlwaysVisible?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: ${HEADER_HEIGHT_REM}rem 0 ${FOOTER_HEIGHT_REM}rem;

  @media only screen and (max-width: 480px) {
    ${({ footerAlwaysVisible }) => !footerAlwaysVisible && "padding-bottom: 1rem;"}
  }
`;

type Props = {
  children: ReactNode;
  projects: ResolvedProject[];
  email: string;
  footerAlwaysVisible?: boolean;
};

const Layout = ({ children, projects, footerAlwaysVisible, email }: Props) => {
  const isMobile = useIsMobile();

  return (
    <>
      <Header projects={projects} />
      <Content footerAlwaysVisible={footerAlwaysVisible}>{children}</Content>
      {(!isMobile || footerAlwaysVisible) && <Footer email={email} />}
    </>
  );
};

export default Layout;
