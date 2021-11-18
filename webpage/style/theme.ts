type Section = "base";

type Element = "background" | "backgroundEmphasized" | "line";

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
      background: "#fdfdfd",
      backgroundEmphasized: "#f0f0f0",
      line: "#b9b9b9",
    },
  },
};

export const getColors = ({ theme }: { theme: Theme }, element: Element, section: Section = "base") =>
  theme.colors[section][element];

export default theme;
