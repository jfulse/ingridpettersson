import styled from "styled-components";
import ImageGallery from "react-image-gallery";

const CarouselWrapper = styled.div<{ thumbnailsWidthPx: number; width?: number | "full"; showThumbnails?: boolean }>`
  width: ${({ width }) => (width === "full" ? "100%" : `${width}px`)};

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

type Props = {
  width: number | "full";
  thumbnailsWidthPx: number;
  showThumbnails?: boolean;
  images: any[]; // TODO
};

const Carousel = ({ width, thumbnailsWidthPx, images, showThumbnails = true }: Props) => (
  <CarouselWrapper width={width} thumbnailsWidthPx={thumbnailsWidthPx} showThumbnails={showThumbnails}>
    <ImageGallery
      items={images}
      showPlayButton={false}
      showFullscreenButton={false}
      thumbnailPosition="right"
      showThumbnails={showThumbnails && images.length > 1}
    />
  </CarouselWrapper>
);

export default Carousel;
