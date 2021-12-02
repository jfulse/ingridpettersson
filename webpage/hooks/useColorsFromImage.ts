import imagePalette, { RGBA } from "image-palette";
import imagePixels from "image-pixels";
import { zip } from "lodash/fp";
import { useEffect, useState } from "react";

// https://stackoverflow.com/a/596241/1540547
// Multiply by A / 255 to get effect of alpha, then divide by 255 to normalize
const divisor = 6 * 255 * 255;
const rgbaToLuma = ([R, G, B, A]: RGBA): number => (A * (R + R + B + G + G + G)) / divisor;

export type Color = { rgba: RGBA; luma: number; amount: number };

const useColorsFromImage = (imageSrc?: string, { maxColors, minAmount } = { maxColors: 10, minAmount: 0 }) => {
  const [colors, setColors] = useState<Color[] | undefined>(undefined);

  useEffect(() => {
    const getColors = async () => {
      if (!imageSrc) return;

      const pixels = await imagePixels(imageSrc);
      const { colors, amount } = imagePalette(pixels, maxColors);

      const result = zip(colors, amount)
        .filter(([_, amount]) => minAmount === 0 || amount! >= minAmount)
        .map(([rgba, amount]) => ({ rgba: rgba!, luma: rgbaToLuma(rgba!), amount: amount! }));

      setColors(result);
    };

    // Use setTimeout so that it happens in a later render cycle, not delaying display of the image
    setTimeout(getColors, 100);
  }, [imageSrc, maxColors, minAmount]);

  return colors;
};

export default useColorsFromImage;
