import { useNextSanityImage } from "next-sanity-image";
import NextImage from "next/image";
import styled from "styled-components";

import { ResolvedImage } from "../types";
import { sanityClient } from "../utils/sanityClient";

type Props = { image: ResolvedImage; height: number };

const ImageWrapper = styled.div<{ height: number; aspectRatio: number }>`
  display: inline-block;
  height: ${({ height }) => `${height}vh`};
  width: ${({ aspectRatio, height }) => `${height * aspectRatio}vh`};
  margin: 0 1.5rem 0 0;
  position: relative;

  &:first-child {
    margin-left: 1.5rem;
  }
`;

const Image = ({ image, height }: Props) => {
  const imageProps = useNextSanityImage(sanityClient, image.asset);
  const aspectRatio = image.asset?.metadata?.dimensions?.aspectRatio;

  if (!aspectRatio) {
    console.error("Image without aspect ratio:", image);
    return null;
  }

  return (
    <ImageWrapper aspectRatio={aspectRatio} height={height}>
      <NextImage {...imageProps} layout="responsive" placeholder="blur" />
    </ImageWrapper>
  );
};

export default Image;
