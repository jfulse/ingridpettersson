import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import styled from "styled-components";

import theme from "../style/theme";
import GlobalStyle from "../style/global";
import Header, { HEADER_HEIGHT } from "../components/Header";
import Footer, { FOOTER_HEIGHT } from "../components/Footer";
import { ContextProvider } from "../context";
import "./reactImageGallery.css";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: ${HEADER_HEIGHT} 0 ${FOOTER_HEIGHT};
`;

// TODO: Create restricted keys

// const PUBLIC_STRIPE_API_KEY =
//   'pk_live_51JhIA7KdnxvJBzuhG0dYWydIqDt2FJYTblmvpUDbessM5Z4mZw5fsrGNirbmvUGwoWqB3YpQdrKRNOq6BJB4Hy0200xnT3bf2K';

const PUBLIC_STRIPE_API_KEY_TEST =
  "pk_test_51JhIA7KdnxvJBzuhhBTUibwsBBaRu8VgjBHEhvyz8pI8xaaj7NgcoFVnTX9dJvbHi742wEjaogFiQVcDqT4UpJxq00PZQD7vId";

const stripePromise = loadStripe(PUBLIC_STRIPE_API_KEY_TEST);

function App({ Component, pageProps }: AppProps) {
  return (
    <Elements stripe={stripePromise}>
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
    </Elements>
  );
}

export default App;
