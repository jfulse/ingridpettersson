import { ReactNode } from "react";
import styled from "styled-components";

import { ResolvedProject } from "../types";
import Header, { HEADER_HEIGHT_REM } from "./Header";
import Footer, { FOOTER_HEIGHT_REM } from "./Footer";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: ${HEADER_HEIGHT_REM}rem 0 ${FOOTER_HEIGHT_REM}rem;
`;

type Props = {
  children: ReactNode;
  projects: ResolvedProject[];
};

const Layout = ({ children, projects }: Props) => {
  return (
    <>
      <Header projects={projects} />
      <Content>{children}</Content>
      <Footer />
    </>
  );
};

export default Layout;
