import styled from "styled-components";

import { getColors, Theme } from "../style/theme";

type ButtonMode = "default" | "callToAction";

type Props = { mode?: ButtonMode; color?: string; backgroundColor?: string; theme: Theme };

const getBackgroundColor = ({ backgroundColor, mode = "default", ...props }: Props) => {
  if (backgroundColor) return backgroundColor;
  if (mode === "callToAction") return getColors(props, "callToAction");
  return getColors(props, "backgroundEmphasized");
};

const Button = styled.button<Props>`
  width: fit-content;
  padding: 0.25rem 0.5rem;
  border: 1px solid gray;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: color 1s ease-in, background-color 1s ease-in;
  background-color: ${getBackgroundColor};
  ${({ color }) =>
    color &&
    `
    color: ${color};
    border-color: ${color};
  `}

  &:hover {
    opacity: 0.6;
  }
`;

export default Button;
