import { useEffect, useState } from "react";
import styled from "styled-components";
import { useWindowSize } from "react-use";

import { ResolvedImage } from "../types";
import isServer from "../utils/isServer";
import Image from "./Image";

const Wrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
`;

type Props = {
  images: ResolvedImage[];
  onClick?: (id?: string) => void;
  maxHeight?: number;
};

// We make sure a maximum of 80% of the first image is shown, to make it obvious
// there is more to the right.
const MAX_IMAGE_VIEW_WIDTH = 80;

const getHeight = (images: ResolvedImage[], windowHeight: number, windowWidth: number, maxHeight: number): number => {
  const firstImageDimensions = images?.[0]?.asset?.metadata?.dimensions;

  if (!firstImageDimensions) return 80;

  const firstImageAspectRatio = firstImageDimensions.aspectRatio;
  const firstImageHeight = firstImageDimensions.height;
  const firstImageWidth = firstImageDimensions.width;
  const firstImageMaxHeight = (windowWidth * MAX_IMAGE_VIEW_WIDTH) / (windowHeight * firstImageAspectRatio);

  return Math.min(firstImageMaxHeight, maxHeight);
};

const ImageBeam = ({ images, onClick, maxHeight = 80 }: Props) => {
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const [height, setHeight] = useState(maxHeight);
  const server = isServer();

  useEffect(() => {
    if (!server) setHeight(getHeight(images, windowHeight, windowWidth, maxHeight));
  }, [images, maxHeight, server, windowHeight, windowWidth]);

  return (
    <Wrapper>
      {images?.map((image) => (
        <Image key={image?.ownerId} image={image} height={height} onClick={onClick} gap="1.5rem" />
      ))}
    </Wrapper>
  );
};

export default ImageBeam;
