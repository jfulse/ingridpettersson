import { useNextSanityImage } from "next-sanity-image";
import NextImage from "next/image";
import { useCallback } from "react";
import styled, { css } from "styled-components";

import { ResolvedImage } from "../types";
import { sanityClient } from "../utils/sanityClient";

type ImageWrapperProps = {
  height?: number;
  width?: number;
  gap?: string;
  aspectRatio: number;
  onClick?: (id?: string) => void;
};

const getDimensions = ({ aspectRatio, height, width, gap }: ImageWrapperProps) => {
  if (!height && !width) return "";
  if (height && width) console.error("Specified both height and width for image");

  if (height) {
    return css`
      height: ${height}vh;
      width: ${height * aspectRatio}vh;
    `;
  }

  return css`
    width: calc(${width}vw - ${gap});
    height: calc(${width! / aspectRatio}vw - ${gap});
  `;
};

const ImageWrapper = styled.div<ImageWrapperProps>`
  display: inline-block;
  margin: ${({ gap }) => `0 ${gap} 0 0`};
  position: relative;

  ${getDimensions}

  &:last-child {
    margin-right: 0;
  }
`;

type Props = {
  image: ResolvedImage;
  height?: number;
  width?: number;
  gap?: string;
  onClick?: (id?: string) => void;
  className?: string;
};

const Image = ({ image, height, width, onClick, className, gap = "0" }: Props) => {
  const imageProps = useNextSanityImage(sanityClient, image?.asset ?? {});
  const aspectRatio = image.asset?.metadata?.dimensions?.aspectRatio;

  const handleClick = useCallback(() => onClick?.(image.ownerId), [image, onClick]);

  if (!aspectRatio) {
    console.error("Image without aspect ratio:", image);
    return null;
  }

  return (
    <ImageWrapper
      aspectRatio={aspectRatio}
      height={height}
      width={width}
      gap={gap}
      onClick={handleClick}
      className={className}
    >
      {/* TODO: If we want speed instead of data saving we can use loading="eager" */}
      <NextImage {...imageProps} layout="responsive" placeholder="blur" />
    </ImageWrapper>
  );
};

export default Image;
