import styled, { css } from "styled-components";

import { getColors, Theme } from "../style/theme";
import { hoverButton } from "../style/utils";

type Props = { color?: string; backgroundColor?: string; theme: Theme };

const getBackgroundColor = ({ backgroundColor, ...props }: Props) => {
  if (backgroundColor) return backgroundColor;
  return getColors(props, "dark");
};

const getColor = ({ color, ...props }: Props) => {
  if (color) return color;
  return getColors(props, "bright");
};

export const buttonMixin = css<Props>`
  width: fit-content;
  padding: 0.25rem 0.5rem;
  border: 1px solid gray;
  border-radius: 0.25rem;
  cursor: pointer;
  color: ${getColor};
  border-color: ${getColor};
  background-color: ${getBackgroundColor};
  text-decoration: none;
  ${hoverButton}

  &:disabled {
    opacity: 1;
    cursor: default;
  }
`;

const Button = styled.button<Props>`
  ${buttonMixin}
`;

export default Button;
