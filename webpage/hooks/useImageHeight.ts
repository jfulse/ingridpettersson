import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";

import { ResolvedImage } from "../types";
import isServer from "../utils/isServer";

const getImageHeight = (
  windowHeight: number,
  windowWidth: number,
  maxHeight: number,
  image?: ResolvedImage,
  maxImageWidthPercentage = 100
): number => {
  const firstImageDimensions = image?.asset?.metadata?.dimensions;

  if (!firstImageDimensions) return maxHeight;

  const firstImageAspectRatio = firstImageDimensions.aspectRatio;
  const firstImageMaxHeight = (windowWidth * maxImageWidthPercentage) / (windowHeight * firstImageAspectRatio);

  return Math.min(firstImageMaxHeight, maxHeight);
};

const useImageHeight = (image?: ResolvedImage, maxHeightPercentage = 100, maxWidthPercentage = 100): number => {
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const [height, setHeight] = useState(maxHeightPercentage);
  const server = isServer();

  useEffect(() => {
    if (server) return;
    const height = getImageHeight(windowHeight, windowWidth, maxHeightPercentage, image, maxWidthPercentage);
    setHeight(height);
  }, [image, maxHeightPercentage, maxWidthPercentage, server, windowHeight, windowWidth]);

  return height;
};

export default useImageHeight;
