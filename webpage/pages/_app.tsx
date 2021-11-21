import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";

import theme from "../style/theme";
import GlobalStyle from "../style/global";
import Header, { HEADER_HEIGHT } from "../components/Header";
import Footer, { FOOTER_HEIGHT } from "../components/Footer";
import { ContextProvider } from "../context";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: ${HEADER_HEIGHT} 0 ${FOOTER_HEIGHT};
`;

function App({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Header />
        <Content>
          <Component {...pageProps} />
        </Content>
        <Footer />
      </ThemeProvider>
    </ContextProvider>
  );
}

export default App;
