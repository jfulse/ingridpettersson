import { ReactNode } from "react";
import styled from "styled-components";

import { ResolvedProject } from "../types";
import Header, { HEADER_HEIGHT } from "./Header";
import Footer, { FOOTER_HEIGHT } from "./Footer";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: ${HEADER_HEIGHT} 0 ${FOOTER_HEIGHT};
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
