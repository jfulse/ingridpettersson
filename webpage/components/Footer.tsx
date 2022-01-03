import styled from "styled-components";

import { getColors } from "../style/theme";

export const FOOTER_HEIGHT_REM = 3;

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  height: ${FOOTER_HEIGHT_REM}rem;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => getColors(props, "background")};
  gap: 0.5rem;
  font-size: 0.8rem;
  z-index: 5; // Win over carousel arrows

  a {
    text-decoration: none;
    color: initial;

    &:hover {
      opacity: 0.6;

      @media only screen and (max-width: 480px) {
        opacity: unset;
      }
    }
  }
`;

const Footer = () => {
  return (
    <Wrapper>
      <a href="https://www.instagram.com/ingridpettersson00/">instagram</a>
      {"/"}
      <a href="https://jfcurated.no/designer/ingrid-pettersson/">stockist</a>
    </Wrapper>
  );
};

export default Footer;
