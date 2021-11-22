import { useMemo } from "react";
import { GetServerSidePropsContext } from "next";
import styled from "styled-components";
import { compose, filter, get, maxBy, minBy } from "lodash/fp";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import Slider from "react-slick";
import ImageGallery from "react-image-gallery";
import { useMeasure, useSize } from "react-use";

import { ResolvedAsset, ResolvedImage, ResolvedPiece } from "../../types";
import useData from "../../hooks/useData";

import getApiUrl from "../../utils/getApiUrl";
import makeGetServerSideProps, { Props } from "../../utils/makeGetServerSideProps";
import { EMPTY_ARRAY } from "../../constants";
import AddToCart from "../../components/AddToCart";

// TODO: Fix styling here. Try removing style and relying on package props?

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

const CarouselWrapper = styled.div<{ width?: number }>`
  width: ${({ width }) => `${width}px`};

  & > div:first-child {
    height: 100%;

    & > div:first-child {
      height: 100%;
    }
  }

  /* & > div:first-child {
    display: flex;

    & > div:first-child {
      flex-grow: 1;
    }

    & > div:nth-child(2) {
      flex-shrink: 1;

      & > div:first-child > ul {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        transform: none !important;
      }
    }
  } */
`;

const ImageWrapper = styled.div`
  height: 100%;
`;

const Measure = styled.div`
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const filterWithAsset = filter(get("asset"));

const dimensionsPath = "asset.metadata.dimensions";

const getMinAspectRatioDimensions = compose(get(dimensionsPath), minBy(`${dimensionsPath}.aspectRatio`));
const getMaxAspectRatioDimensions = compose(get(dimensionsPath), maxBy(`${dimensionsPath}.aspectRatio`));

const Piece = (props: Props<ResolvedPiece>) => {
  const { data } = useData(props.apiUrl);
  const piece = data || props.data;

  const product = useMemo(() => (piece.product ? { ...piece.product, piece } : undefined), [piece]);

  const images = useMemo(
    () =>
      filterWithAsset(piece.images || EMPTY_ARRAY).map(({ asset }) => ({ original: asset.url, thumbnail: asset.url })),
    [piece]
  );

  const minAspectRatio = Math.min(
    ...(piece.images ?? []).map(({ asset }: ResolvedImage) => asset?.metadata?.dimensions?.aspectRatio ?? Infinity)
  );

  const minAspectRatioDimensions = minBy(get("asset.metadata.dimensions.aspectRatio"))(piece.images);
  const maxAspectRatioDimensions = maxBy(get("asset.metadata.dimensions.aspectRatio"))(piece.images);

  const maxAspectRatio = Math.max(
    ...(piece.images ?? []).map(({ asset }: ResolvedImage) => asset?.metadata?.dimensions?.aspectRatio ?? 0)
  );
  // console.log("🥶🥶🥶", {
  //   piece,
  //   minAspectRatio,
  //   MAPPED: (piece.images ?? []).map(
  //     ({ asset }: ResolvedImage) => asset?.metadata?.dimensions?.aspectRatio ?? Infinity
  //   ),
  // });

  // const [sized, { height }] = useSize(() => <Measure />, { width: 100, height: 100 });
  const [ref, { height: maxHeight }] = useMeasure<HTMLDivElement>();

  // AR = W / H => W = AR * H

  // const { aspectRatio, height: imageHeight, width: imageWidth } = getMinAspectRatioDimensions(piece.images ?? []);
  // const width = (imageWidth * maxHeight) / (imageHeight * aspectRatio);
  // const width = (imageWidth * maxHeight * aspectRatio) / imageHeight;
  // const width = Math.min(maxHeight * aspectRatio, maxHeight);
  const { aspectRatio, height: imageHeight, width: imageWidth } = getMaxAspectRatioDimensions(piece.images ?? []);
  // const width = (imageWidth * maxHeight * aspectRatio) / imageHeight;
  // const width = (imageWidth * maxHeight) / (imageHeight * aspectRatio);
  // const width = maxHeight * aspectRatio;

  // TODO: This isn't quite right yet
  const width = Math.min(maxHeight * aspectRatio, maxHeight);

  // console.log("🎉", {
  //   width,
  //   maxHeight,
  //   imageHeight,
  //   imageWidth,
  //   minAspectRatio,
  //   maxAspectRatio,
  //   minAspectRatioDimensions,
  //   maxAspectRatioDimensions,
  //   getMinAspectRatioDimensions: getMinAspectRatioDimensions(piece.images ?? []),
  //   getMaxAspectRatioDimensions: getMaxAspectRatioDimensions(piece.images ?? []),
  // });

  return (
    <Wrapper ref={ref}>
      <CarouselWrapper width={width}>
        <ImageGallery items={images} showPlayButton={false} showFullscreenButton={false} thumbnailPosition="right" />
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
