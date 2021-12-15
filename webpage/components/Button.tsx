import styled, { css } from "styled-components";

import { getColors, Theme } from "../style/theme";

type ButtonMode = "default" | "callToAction";

type Props = { mode?: ButtonMode; color?: string; backgroundColor?: string; theme: Theme };

const getBackgroundColor = ({ backgroundColor, mode = "default", ...props }: Props) => {
  if (backgroundColor) return backgroundColor;
  if (mode === "callToAction") return getColors(props, "callToAction");
  return getColors(props, "backgroundEmphasized");
};

export const buttonMixin = css<Props>`
  width: fit-content;
  padding: 0.25rem 0.5rem;
  border: 1px solid gray;
  border-radius: 0.25rem;
  cursor: pointer;
  background-color: ${getBackgroundColor};
  text-decoration: none;

  ${({ color }) =>
    color &&
    `
    color: ${color};
    border-color: ${color};
  `}

  &:hover {
    opacity: 0.6;

    @media only screen and (max-width: 480px) {
      opacity: unset;
    }
  }
`;

const Button = styled.button<Props>`
  ${buttonMixin}
`;

export default Button;
