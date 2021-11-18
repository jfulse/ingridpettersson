import styled from "styled-components";

import { getColors } from "../style/theme";

export const FOOTER_HEIGHT = "3rem";

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  height: ${FOOTER_HEIGHT};
  justify-content: space-around;
  align-items: center;
  background-color: ${(props) => getColors(props, "background")};

  a {
    text-decoration: none;

    &:hover {
      opacity: 0.6;
    }
  }
`;

const Footer = () => {
  return (
    <Wrapper>
      <a href="https://www.instagram.com/ingridpettersson00/">instagram</a>
      <span>shop{/* TODO */}</span>
    </Wrapper>
  );
};

export default Footer;
