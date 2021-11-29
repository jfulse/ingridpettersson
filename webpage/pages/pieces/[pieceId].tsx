import { useMemo } from "react";
import { GetServerSidePropsContext } from "next";
import styled from "styled-components";
import { compose, filter, get, minBy } from "lodash/fp";
import ImageGallery from "react-image-gallery";
import { useMeasure } from "react-use";

import { ResolvedPiece } from "../../types";
import useData from "../../hooks/useData";

import getApiUrl from "../../utils/getApiUrl";
import makeGetServerSideProps, { Props } from "../../utils/makeGetServerSideProps";
import { EMPTY_ARRAY } from "../../constants";
import AddToCart from "../../components/AddToCart";

const getPieceSlug = (context: GetServerSidePropsContext) => context.query?.pieceId;

const getPieceApiUrl = (context: GetServerSidePropsContext) => `${getApiUrl()}/api/pieces/${context.query.pieceId}`;

export const getServerSideProps = makeGetServerSideProps(getPieceApiUrl, getPieceSlug);

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media only screen and (max-width: 480px) {
    flex-direction: column;
  }
`;

const InfoWrapper = styled.div`
  margin: 0;
  padding: 0 1rem;
  white-space: nowrap;
`;

const Title = styled.h2`
  margin: 0;
  padding: 0;
`;

const SubTitle = styled.h3`
  margin: 1rem 0;
  padding: 0;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const THUMBNAILS_WIDTH_PX = 100;

const CarouselWrapper = styled.div<{ thumbnailsWidthPx: number; width?: number }>`
  width: ${({ width }) => `${width}px`};

  & > div:first-child {
    width: 100%;

    & > div:first-child {
      width: 100%;
      display: flex;
      flex-direction: row;

      & > div:first-child {
        ${({ thumbnailsWidthPx }) => `width: calc(100% - ${thumbnailsWidthPx}px)`};
      }
    }
  }
`;

const filterWithAsset = filter(get("asset"));

const dimensionsPath = "asset.metadata.dimensions";

const getMinAspectRatioDimensions = compose(get(dimensionsPath), minBy(`${dimensionsPath}.aspectRatio`));

const Piece = (props: Props<ResolvedPiece>) => {
  const { data } = useData(props.apiUrl);
  const piece = data || props.data;

  const product = useMemo(() => (piece.product ? { ...piece.product, piece } : undefined), [piece]);

  const images = useMemo(
    () =>
      filterWithAsset(piece.images || EMPTY_ARRAY).map(({ asset }) => ({ original: asset.url, thumbnail: asset.url })),
    [piece]
  );

  const thumbnailsWidthPx = images.length > 1 ? THUMBNAILS_WIDTH_PX : 0;
  const [ref, { height: screenHeight, width: screenWidth }] = useMeasure<HTMLDivElement>();
  const { aspectRatio, height: imageHeight, width: imageWidth } = getMinAspectRatioDimensions(piece.images ?? []);

  const maxWidth = screenWidth - thumbnailsWidthPx;
  const desiredWidth = aspectRatio <= 1 ? screenHeight * aspectRatio : maxWidth;
  const width = Math.min(desiredWidth, maxWidth) + thumbnailsWidthPx;

  return (
    <Wrapper ref={ref}>
      <CarouselWrapper width={width} thumbnailsWidthPx={thumbnailsWidthPx}>
        <ImageGallery
          items={images}
          showPlayButton={false}
          showFullscreenButton={false}
          thumbnailPosition="right"
          showThumbnails={images.length > 1}
        />
        {/*sized*/}
      </CarouselWrapper>
      <InfoWrapper>
        <Title>{piece.title}</Title>
        <Info>
          {piece.category && <SubTitle>{piece.category}</SubTitle>}
          {piece.description && <div>{piece.description}</div>}
          {piece.material && <div>{piece.material}</div>}
          {piece.size && <div>{piece.size}</div>}
          {piece.care && <div>{piece.care}</div>}
          {piece.size && <div>size: {piece.size}</div>}
        </Info>
        {product && (
          <>
            <br />
            <AddToCart product={product} />
          </>
        )}
      </InfoWrapper>
    </Wrapper>
  );
};

export default Piece;
