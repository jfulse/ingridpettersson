import styled from "styled-components";
import ImageGallery from "react-image-gallery";
import { ReactNode, forwardRef } from "react";

const CarouselWrapper = styled.div<{ thumbnailsWidthPx: number; width?: number | "full"; showThumbnails?: boolean }>`
  width: ${({ width }) => (width === "full" ? "100%" : `${width}px`)};
  position: relative;

  & > div:first-child {
    width: 100%;

    & > div:first-child {
      width: 100%;
      display: flex;
      flex-direction: row;

      & > div:first-child {
        ${({ thumbnailsWidthPx, showThumbnails = true }) =>
          `width: calc(100% - ${showThumbnails ? thumbnailsWidthPx : 0}px)`};
      }
    }
  }
`;

const ChildrenWrapper = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;

  @media only screen and (max-width: 480px) {
    top: 1rem;
    left: 1rem;
  }
`;

type Props = {
  width: number | "full";
  thumbnailsWidthPx: number;
  showThumbnails?: boolean;
  images: any[]; // TODO
  children?: ReactNode;
};

const Carousel = forwardRef(
  ({ width, thumbnailsWidthPx, images, children, showThumbnails = true }: Props, ref: any) => (
    <CarouselWrapper width={width} thumbnailsWidthPx={thumbnailsWidthPx} showThumbnails={showThumbnails}>
      <ImageGallery
        items={images}
        showPlayButton={false}
        showFullscreenButton={false}
        thumbnailPosition="right"
        showThumbnails={showThumbnails && images.length > 1}
        // @ts-ignore
        ref={ref}
      />
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </CarouselWrapper>
  )
);

Carousel.displayName = "Carousel";

export default Carousel;
