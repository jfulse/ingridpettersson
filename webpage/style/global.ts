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
  }

  input, select, button {
    ${fontSize}
    ${fontFamily}
  }
`;

export default GlobalStyle;
