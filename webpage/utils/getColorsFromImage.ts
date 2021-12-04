import imagePalette, { RGBA } from "image-palette";
import imagePixels from "image-pixels";
import { zip } from "lodash/fp";

import { Color } from "../types";

// https://stackoverflow.com/a/596241/1540547
// Multiply by A / 255 to get effect of alpha, then divide by 255 to normalize
const divisor = 6 * 255 * 255;
const rgbaToLuma = ([R, G, B, A]: RGBA): number => (A * (R + R + B + G + G + G)) / divisor;

const getColorsFromImage = async (
  imageSrc: string,
  { maxColors, minAmount } = { maxColors: 10, minAmount: 0 }
): Promise<Color[] | undefined> => {
  const pixels = await imagePixels(imageSrc);
  const { colors, amount } = imagePalette(pixels, maxColors);

  return zip(colors, amount)
    .filter(([_, amount]) => minAmount === 0 || amount! >= minAmount)
    .map(([rgba, amount]) => ({ rgba: rgba!, luma: rgbaToLuma(rgba!), amount: amount! }));
};

export default getColorsFromImage;
