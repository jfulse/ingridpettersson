import { useMemo } from "react";
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

const CarouselWrapper = styled.div`
  height: 100%;

  & > div:first-child {
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

  const product = useMemo(() => (piece.product ? { ...piece.product, piece } : undefined), [piece]);

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
