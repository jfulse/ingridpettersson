import { createGlobalStyle, css } from "styled-components";
import { Theme, getColors } from "./theme";

const fontFamily = css`
  font-family: Georgia, Helvetica, sans-serif;
`;

const fontSize = css`
  font-size: 18px;
`;

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  html {
    ${fontSize}
    ${fontFamily}
    background-color: ${(props) => getColors(props, "background")}
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
    ${fontFamily}
  }
`;

export default GlobalStyle;
