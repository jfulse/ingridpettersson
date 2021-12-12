import { useMemo } from "react";
import { GetStaticPathsResult } from "next";
import styled from "styled-components";
import { compose, filter, get, minBy } from "lodash/fp";
import ImageGallery from "react-image-gallery";
import { useMeasure } from "react-use";
// @ts-ignore
import BlockContent from "@sanity/block-content-to-react";

import { ResolvedPiece } from "../../types";
import useData from "../../hooks/useData";
import makeGetStaticProps, { Props } from "../../utils/makeGetStaticProps";
import getColorsFromImage from "../../utils/getColorsFromImage";
import getPiece from "../../queries/getPiece";
import getPieceIds from "../../queries/getPieceIds";
import { EMPTY_ARRAY } from "../../constants";
import AddToCart from "../../components/AddToCart";
import Layout from "../../components/Layout";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import useIsMobile from "../../hooks/useIsMobile";
import getContrastingColors from "../../utils/getContrastingColors";

// TODO: Use lower quality image for color stuff
// TODO: Only use color stuff on illustrations?

// TODO: Instead of useMeasure, use avail height and subtract header + footer,
// to make it stable on mobile?

export const getStaticPaths = async (): Promise<GetStaticPathsResult> => {
  const pieceIds = await getPieceIds();
  const paths = pieceIds.map((id) => `/pieces/${id}`);

  return { paths, fallback: "blocking" };
};

const getPieceSlug = (params: NextParsedUrlQuery | null) => params?.pieceId ?? null;

type Data = {
  piece: ResolvedPiece | null;
  contrastingColors: { color: string; background: string };
};

const getData = async (params: NextParsedUrlQuery | null, skipColors = false): Promise<Data> => {
  const piece = await getPiece(params);
  const firstImageUrl = piece?.images?.[0]?.asset?.url;
  const colors = firstImageUrl ? await getColorsFromImage(firstImageUrl) : undefined;
  const contrastingColors = getContrastingColors(colors);

  return { piece, contrastingColors };
};

const getPieceOnly = async (params: NextParsedUrlQuery | null, skipColors = false): Promise<Partial<Data>> => {
  const piece = await getPiece(params);

  return { piece };
};

export const getStaticProps = makeGetStaticProps(getData, getPieceSlug);

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 1.5rem;

  @media only screen and (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const InfoWrapper = styled.div<{ background?: string; color?: string }>`
  margin: 0;
  padding: 2rem;
  flex-grow: 1;
  margin: 0 0 0 2rem;
  ${({ color }) => color && `color: ${color};`}
  ${({ background }) => background && `background-color: ${background};`}
  line-height: 1.5rem;

  @media only screen and (max-width: 480px) {
    margin: 2rem 0 0 0;
    padding-bottom: 2rem;
    width: 100%;
  }
`;

const Title = styled.h2<{ color?: string }>`
  margin: 0 0 1rem;
  padding: 0;
  ${({ color }) => color && `color: ${color};`}
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

const Piece = (props: Props<Data>) => {
  const isMobile = useIsMobile();
  const { data } = useData<Partial<Data>>(getPieceOnly, `pieces/${props.slug}`, props.params);
  const piece = data?.piece || props.data?.piece;
  // We don't recalculate colors, to save cpu
  const { color, background } = props.data?.contrastingColors || {};

  const product = useMemo(() => (piece?.product ? { ...piece.product, piece } : undefined), [piece]);

  const images = useMemo(
    () =>
      filterWithAsset(piece?.images ?? EMPTY_ARRAY).map(({ asset }) => ({ original: asset.url, thumbnail: asset.url })),
    [piece]
  );

  const thumbnailsWidthPx = images.length > 1 ? THUMBNAILS_WIDTH_PX : 0;
  const [ref, { height: screenHeight, width: screenWidth }] = useMeasure<HTMLDivElement>();
  // @ts-ignore TODO
  const { aspectRatio } = getMinAspectRatioDimensions(piece?.images ?? EMPTY_ARRAY);

  const maxWidth = screenWidth - thumbnailsWidthPx;
  // TODO: Not sure about the mobile height here
  const maxHeight = isMobile ? screenHeight - 90 : screenHeight;
  const desiredWidth = aspectRatio <= 1 ? maxHeight * aspectRatio : maxWidth;
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
        </CarouselWrapper>
        <InfoWrapper background={background} color={color}>
          <Title color={color}>{piece?.title}</Title>
          <Info>
            <BlockContent blocks={piece?.description} />
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
