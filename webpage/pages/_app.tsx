import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";

import theme from "../style/theme";
import GlobalStyle from "../style/global";
import Header from "../views/Header";

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Component {...pageProps} />
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
