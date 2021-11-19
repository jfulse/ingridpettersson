import { ReactChild, useMemo } from "react";
import { GetServerSidePropsContext } from "next";
import { Carousel } from "react-responsive-carousel";
import styled from "styled-components";
import { filter, get } from "lodash/fp";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { ResolvedAsset, ResolvedImage, ResolvedPiece } from "../../types";
import useData from "../../hooks/useData";

import getApiUrl from "../../utils/getApiUrl";
import makeGetServerSideProps, { Props } from "../../utils/makeGetServerSideProps";
import { EMPTY_ARRAY } from "../../constants";

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

const Title = styled.h2`
  margin: 0;
  padding: 0;
`;

const CarouselWrapper = styled.div`
  height: 100%;

  & > div:first-child {
    display: grid;
    grid-template-columns: 1fr auto;

    & > div:nth-child(2) > div:first-child > ul {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      transform: none !important;
    }
  }
`;

const ImageWrapper = styled.div`
  height: 100%;
`;

const filterWithAsset = filter(get("asset"));

const Piece = (props: Props<ResolvedPiece>) => {
  const { data } = useData(props.apiUrl);
  const piece = data || props.data;

  const images: (ResolvedImage & { asset: ResolvedAsset })[] = useMemo(
    () => filterWithAsset(piece.images || EMPTY_ARRAY),
    [piece]
  );
  console.log("✅", { piece, data, props, images });

  return (
    <Wrapper>
      <CarouselWrapper>
        <Carousel infiniteLoop dynamicHeight transitionTime={600} showStatus={false} showIndicators={false}>
          {images.map(({ _key, asset }) => (
            <ImageWrapper key={_key}>
              <img src={asset.url} />
            </ImageWrapper>
          ))}
        </Carousel>
      </CarouselWrapper>
      <Title>{piece.title}</Title>
    </Wrapper>
  );
};

export default Piece;
