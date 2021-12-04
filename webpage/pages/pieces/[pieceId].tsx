import { useMemo } from "react";
import { GetStaticPathsResult, GetStaticPropsContext } from "next";
import styled from "styled-components";
import { compose, filter, get, minBy } from "lodash/fp";
import ImageGallery from "react-image-gallery";
import { useMeasure } from "react-use";

import { ResolvedPiece } from "../../types";
import useColorsFromImage from "../../hooks/useColorsFromImage";
import useData from "../../hooks/useData";
import makeGetStaticProps, { Props } from "../../utils/makeGetStaticProps";
import getPiece from "../../queries/getPiece";
import { EMPTY_ARRAY } from "../../constants";
import AddToCart from "../../components/AddToCart";
import useContrastingColors from "../../hooks/useContrastingColors";
import Layout from "../../components/Layout";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

// TODO: Use lower quality image for color stuff
// TODO: Only use color stuff on illustrations?

export const getStaticPaths = (): GetStaticPathsResult => ({ paths: [], fallback: "blocking" });

// export const getStaticPaths = (): GetStaticPathsResult => ({ paths: [], fallback: "blocking" });

const getPieceSlug = (params: NextParsedUrlQuery | null) => params?.pieceId ?? null;

export const getStaticProps = makeGetStaticProps(getPiece, getPieceSlug);

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

const InfoWrapper = styled.div<{ background?: string; color?: string }>`
  margin: 0;
  padding: 2rem;
  flex-grow: 1;
  margin: 0 0 0 2rem;
  ${({ color }) => color && `color: ${color};`}
  ${({ background }) => background && `background-color: ${background};`}
  transition: color 1s ease-in, background-color 1s ease-in;
  line-height: 1.5rem;

  @media only screen and (max-width: 480px) {
    margin: 2rem 0 0 0;
    padding-bottom: 5rem;
  }
`;

const Title = styled.h2<{ color?: string }>`
  margin: 0;
  padding: 0;
  ${({ color }) => color && `color: ${color};`}
  transition: color 1s ease-in, background-color 1s ease-in;
  line-height: 1.75rem;
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
  const { data } = useData<ResolvedPiece>(getPiece, `pieces/${props.slug}`, props.params);
  const piece = data || props.data;

  const product = useMemo(() => (piece?.product ? { ...piece.product, piece } : undefined), [piece]);

  const images = useMemo(
    () =>
      filterWithAsset(piece?.images ?? EMPTY_ARRAY).map(({ asset }) => ({ original: asset.url, thumbnail: asset.url })),
    [piece]
  );

  const colors = useColorsFromImage(piece?.images?.[0]?.asset?.url);
  const { color, background } = useContrastingColors(colors);

  const thumbnailsWidthPx = images.length > 1 ? THUMBNAILS_WIDTH_PX : 0;
  const [ref, { height: screenHeight, width: screenWidth }] = useMeasure<HTMLDivElement>();
  // @ts-ignore TODO
  const { aspectRatio } = getMinAspectRatioDimensions(piece?.images ?? EMPTY_ARRAY);

  const maxWidth = screenWidth - thumbnailsWidthPx;
  const desiredWidth = aspectRatio <= 1 ? screenHeight * aspectRatio : maxWidth;
  const width = Math.min(desiredWidth, maxWidth) + thumbnailsWidthPx;

  return (
    <Layout projects={props.projects}>
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
        <InfoWrapper background={background} color={color}>
          <Title color={color}>{piece?.title}</Title>
          <Info>
            {piece?.category && <SubTitle>{piece?.category}</SubTitle>}
            {piece?.description && <div>{piece?.description}</div>}
            {piece?.material && <div>{piece?.material}</div>}
            {piece?.size && <div>{piece?.size}</div>}
            {piece?.care && <div>{piece?.care}</div>}
            {piece?.size && <div>size: {piece?.size}</div>}
          </Info>
          {product && (
            <>
              <br />
              <AddToCart product={product} color={background} backgroundColor={color} />
            </>
          )}
        </InfoWrapper>
      </Wrapper>
    </Layout>
  );
};

export default Piece;
