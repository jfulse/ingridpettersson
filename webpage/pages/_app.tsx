import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import theme from "../style/theme";
import GlobalStyle from "../style/global";
import { ContextProvider } from "../context";
import "./reactImageGallery.css";

// TODO: Create restricted keys

const PUBLIC_STRIPE_API_KEY =
  "pk_live_51JhIA7KdnxvJBzuhG0dYWydIqDt2FJYTblmvpUDbessM5Z4mZw5fsrGNirbmvUGwoWqB3YpQdrKRNOq6BJB4Hy0200xnT3bf2K";

// const PUBLIC_STRIPE_API_KEY_TEST =
//   "pk_test_51JhIA7KdnxvJBzuhhBTUibwsBBaRu8VgjBHEhvyz8pI8xaaj7NgcoFVnTX9dJvbHi742wEjaogFiQVcDqT4UpJxq00PZQD7vId";

const stripePromise = loadStripe(PUBLIC_STRIPE_API_KEY);

function App({ Component, pageProps }: AppProps) {
  return (
    <Elements stripe={stripePromise}>
      <ContextProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Component {...pageProps} />
        </ThemeProvider>
      </ContextProvider>
    </Elements>
  );
}

export default App;
