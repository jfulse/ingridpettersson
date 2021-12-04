import { useEffect, useState } from "react";
import { maxBy, mean, minBy, prop, range } from "lodash/fp";
import { RGBA } from "image-palette";

import { Color } from "./useColorsFromImage";

const minContrast = 4;

type ItemWithLuma = { luma: number };

const EMPTY_COLOR = { luma: -1, rgba: [0, 0, 0, 0] as RGBA, amount: 0 };

const getContrast = (
  { luma: luma1 }: ItemWithLuma = EMPTY_COLOR,
  { luma: luma2 }: ItemWithLuma = EMPTY_COLOR
): number => Math.max(luma1, luma2) / Math.min(luma1, luma2);

const tryGettingContrastingColors = (colors: Color[]): Color[] | undefined => {
  const brightestColor = maxBy(prop("luma"), colors)!;
  const darkestColor = minBy(prop("luma"), colors)!;

  const brightestAndDarkestContrast = getContrast(brightestColor, darkestColor);

  if (brightestAndDarkestContrast >= minContrast) return [brightestColor, darkestColor];

  const brightestContrast = getContrast(brightestColor, { luma: 0 });
  const darkestContrast = getContrast(darkestColor, { luma: 1 });

  if ([brightestContrast, darkestContrast].every((c) => c < minContrast)) return undefined;
  if (brightestContrast > darkestContrast) return [brightestColor];
  return [darkestColor];
};

const rgbaToColorString = ({ rgba: [R, G, B, A] }: Color = EMPTY_COLOR): string => `rgba(${R}, ${G}, ${B}, ${A})`;

const isNotGrayTone = ({ luma, rgba: [R, G, B] }: Color): boolean => {
  // We count very bright or dark colors as graytone
  if (luma < 0.1 || luma > 0.9) return false;
  const meanHue = mean([R, G, B]);
  return [R, G, B].every((hue) => Math.abs(hue - meanHue) / 255 > 0.02);
};

const hasN =
  (n: number) =>
  (list?: any[]): boolean =>
    (list?.length ?? 0) >= n;

const hasTwo = hasN(2);
const hasOne = hasN(1);

// TODO: From theme?
const DEFAULT_DARK_COLOR = "rgba(0, 0, 0, 255)";
const DEFAULT_BRIGHT_COLOR = "rgba(255, 255, 255, 255)";

const chooseColors = (contrastingColors?: Color[]): { color: string; background: string } => {
  if (!contrastingColors) return { color: DEFAULT_DARK_COLOR, background: DEFAULT_BRIGHT_COLOR };
  const colors = contrastingColors.map(rgbaToColorString);

  if (contrastingColors.length === 1) {
    if (contrastingColors[0].luma < 0.5) return { color: DEFAULT_BRIGHT_COLOR, background: colors[0] };
    return { color: DEFAULT_DARK_COLOR, background: colors[0] };
  }

  return { color: colors[1], background: colors[0] };
};

// Use some heuristics to get two or one color(s) that are prominent and have high contrast
const useContrastingColors = (colors: Color[] | undefined): { color: string; background: string } => {
  const [contrastingColors, setContrastingColors] = useState<Color[] | undefined>(undefined);

  useEffect(() => {
    if (!colors) return;
    const colorsNotGraytone = colors.filter(isNotGrayTone);

    const testResults = range(3, 8).map((nColors) => tryGettingContrastingColors(colorsNotGraytone.slice(0, nColors)));

    setContrastingColors(testResults.find(hasTwo) || testResults.find(hasOne));
  }, [colors]);

  return chooseColors(contrastingColors);
};

export default useContrastingColors;
