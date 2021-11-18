import styled, { css } from "styled-components";
import { ResolvedImage } from "../types";

import Image from "./Image";

const easeIn = css`
  transition: opacity 0.3s ease-in;
`;

const easeOut = css`
  transition: opacity 0.3s ease-out;
`;

const StyledImage = styled(Image)<{ primary?: boolean; secondary?: boolean }>`
  width: 100%;
  height: 100%;
  margin: auto;
  ${easeIn}

  ${({ secondary }) =>
    secondary &&
    `
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        ${easeOut}
    `};
`;

const Wrapper = styled.div<{ singleImage: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  h4 {
    opacity: 0;
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 1;
    ${easeOut}
    text-shadow: -5px -5px 10px white, 5px -5px 10px white, -5px 5px 10px white, 5px 5px 10px white;

    & + h4 {
      top: unset;
      left: unset;
      bottom: 1rem;
      right: 1rem;
    }
  }

  &:hover {
    ${StyledImage}:first-child {
      ${({ singleImage }) => !singleImage && "opacity: 0"};
    }

    h4 {
      opacity: 1;
      ${easeIn}
    }

    ${StyledImage}:last-child {
      opacity: 1;
    }
  }
`;

export type DecoratedImageProps = {
  id: string;
  image?: ResolvedImage;
  secondaryImage?: ResolvedImage;
  title?: string;
  subtitle?: string;
  href?: string;
};

const DecoratedImage = ({ image, secondaryImage, title, subtitle, href }: DecoratedImageProps) => {
  if (!image) return null;

  return (
    <Wrapper singleImage={!secondaryImage}>
      <StyledImage image={image} primary href={href} />
      {title && <h4>{title}</h4>}
      {subtitle && <h4>{subtitle}</h4>}
      {secondaryImage && <StyledImage image={secondaryImage} secondary href={href} />}
    </Wrapper>
  );
};

export default DecoratedImage;
