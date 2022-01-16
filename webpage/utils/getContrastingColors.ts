import { maxBy, minBy, prop, range } from "lodash/fp";

import { brightColor, darkColor } from "../style/global";
import { Color } from "../types";
import { EMPTY_COLOR } from "../constants";
import rgbaToColorString from "./rgbaToColorString";
import standardDeviation from "./standardDeviation";

const minContrast = 4;

type ItemWithLuma = { luma: number };

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

const isNotGrayTone = ({ luma, rgba: [R, G, B] }: Color): boolean => {
  // We count very bright or dark colors as graytone
  if (luma < 0.1 || luma > 0.9) return false;
  return standardDeviation([R, G, B]) >= 15;
};

const hasN =
  (n: number) =>
  (list?: any[]): boolean =>
    (list?.length ?? 0) >= n;

const hasTwo = hasN(2);
const hasOne = hasN(1);

const DEFAULT_COLORS = { color: darkColor, background: brightColor };

const chooseColors = (contrastingColors?: Color[]): { color: string; background: string } => {
  if (!contrastingColors) return DEFAULT_COLORS;
  const colors = contrastingColors.map(rgbaToColorString);

  if (contrastingColors.length === 1) {
    if (contrastingColors[0].luma < 0.5) return { color: brightColor, background: colors[0] };
    return { color: darkColor, background: colors[0] };
  }

  return { color: colors[1], background: colors[0] };
};

// Use some heuristics to get two or one color(s) that are prominent and have high contrast
const getContrastingColors = (colors: Color[] | undefined): { color: string; background: string } => {
  if (!colors) return DEFAULT_COLORS;

  const colorsNotGraytone = colors.filter(isNotGrayTone);
  const testResults = range(3, 8).map((nColors) => tryGettingContrastingColors(colorsNotGraytone.slice(0, nColors)));
  const contrasting = testResults.find(hasTwo) || testResults.find(hasOne);

  return { ...chooseColors(contrasting) };
};

export default getContrastingColors;
