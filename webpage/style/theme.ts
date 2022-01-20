import { brightColor, darkColor } from "./global";

type Section = "base";

type Element = "background" | "backgroundEmphasized" | "line" | "bright" | "dark";

export type Theme = {
  colors: {
    [key in Section]: {
      [element in Element]: string;
    };
  };
};

const theme: Theme = {
  colors: {
    base: {
      background: brightColor,
      backgroundEmphasized: "#f0f0f0",
      line: "#b9b9b9",
      bright: brightColor,
      dark: darkColor,
    },
  },
};

export const getColors = ({ theme }: { theme: Theme }, element: Element, section: Section = "base") =>
  theme.colors[section][element];

export default theme;
