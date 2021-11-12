import { createGlobalStyle, css } from "styled-components";

const fontFamily = css`
  font-family: Georgia, Helvetica, sans-serif;
`;

const fontSize = css`
  font-size: 18px;
`;

const GlobalStyle = createGlobalStyle`
  html {
    ${fontSize}
    ${fontFamily}
}

input, select, button {
    ${fontSize}
    ${fontFamily}
  }
`;

export default GlobalStyle;
