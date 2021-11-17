import { useNextSanityImage } from "next-sanity-image";
import NextImage from "next/image";
import styled, { css } from "styled-components";

import { ResolvedImage } from "../types";
import { sanityClient } from "../utils/sanityClient";
import MaybeLink from "./MaybeLink";

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
  href?: string;
  className?: string;
};

const Image = ({ image, height, width, href, className, gap = "0" }: Props) => {
  const imageProps = useNextSanityImage(sanityClient, image?.asset ?? {});
  const aspectRatio = image.asset?.metadata?.dimensions?.aspectRatio;

  if (!aspectRatio) {
    console.error("Image without aspect ratio:", image);
    return null;
  }

  return (
    <ImageWrapper aspectRatio={aspectRatio} height={height} width={width} gap={gap} className={className}>
      <MaybeLink href={href}>
        {/* TODO: If we want speed instead of data saving we can use loading="eager" */}
        <NextImage {...imageProps} layout="responsive" placeholder="blur" />
      </MaybeLink>
    </ImageWrapper>
  );
};

export default Image;
