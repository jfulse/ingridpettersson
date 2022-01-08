import { css } from "styled-components";

export const hoverButton = css`
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.6;

    @media only screen and (max-width: 480px) {
      opacity: unset;
    }
  }
`;
