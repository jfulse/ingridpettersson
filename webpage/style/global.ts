import { createGlobalStyle, css } from "styled-components";
import { Theme, getColors } from "./theme";

const fontSize = css`
  font-size: 18px;
`;

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  @font-face {
    font-family: "PTSans";
    src: url("/fonts/PTSans/PTSans-Regular.ttf");
    font-style: normal;
    font-weight: 400;
    font-display: swap;
  }

  @font-face {
    font-family: "PTSans";
    src: url("/fonts/PTSans/PTSans-Bold.ttf");
    font-style: normal;
    font-weight: 500;
    font-display: swap;
  }

  @font-face {
    font-family: "PTSans";
    src: url("/fonts/PTSans/PTSans-Italic.ttf");
    font-style: italic;
    font-weight: 400;
    font-display: swap;
  }

  @font-face {
    font-family: "PTSans";
    src: url("/fonts/PTSans/PTSans-BoldItalic.ttf");
    font-style: italic;
    font-weight: 500;
    font-display: swap;
  }

  html {
    ${fontSize}
    font-family: PTSans;
    background-color: ${(props) => getColors(props, "background")};
    height: 100vh;
    width: 100vw;
    
    * {
      box-sizing: border-box;
    }
  }

  body {
    margin: 0;
    height: 100vh;
    width: 100vw;
  }

  input, select, button {
    ${fontSize}
    font-family: PTSans;
  }
`;

export default GlobalStyle;
