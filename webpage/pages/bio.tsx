import styled, { css } from "styled-components";
import NextImage from "next/image";
import { useNextSanityImage, UseNextSanityImageProps } from "next-sanity-image";

import { EMPTY_OBJECT } from "../constants";
import useData from "../hooks/useData";
import useImageHeight from "../hooks/useImageHeight";
import makeGetStaticProps, { Props } from "../utils/makeGetStaticProps";
import getBio from "../queries/getBio";
import Layout from "../components/Layout";
import { ResolvedBio } from "../types";
import { FOOTER_HEIGHT_REM } from "../components/Footer";
import { HEADER_HEIGHT_REM } from "../components/Header";
import { sanityClient } from "../utils/sanityClient";
import useIsMobile from "../hooks/useIsMobile";

// TODO: Looks like https://ingridpettersson.com/about.html has a different font

export const getStaticProps = makeGetStaticProps(getBio);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1.5rem;
  line-height: 1.5rem;
  height: 100%;
  overflow-y: auto;
  position: relative;
`;

const BORDER_REM = FOOTER_HEIGHT_REM + HEADER_HEIGHT_REM;

const ImageWrapper = styled.div<{ height: number; aspectRatio: number }>`
  left: 1.5rem;
  top: 0;
  ${({ aspectRatio, height }) => `
  height: calc(${height}vh - ${BORDER_REM}rem);
  width: calc(${height * aspectRatio}vh - ${BORDER_REM * aspectRatio}rem);
  `}

  @media only screen and (max-width: 480px) {
    width: 100%;
    height: unset;
    position: relative;
    left: 0;
    margin-top: 1rem;
  }
`;

const TextWrapper = styled.div<{ height: number; aspectRatio: number }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  margin-left: 1.5rem;
  left: ${({ height, aspectRatio }) => `calc(${height * aspectRatio}vh - ${BORDER_REM * aspectRatio}rem)`};

  @media only screen and (max-width: 480px) {
    position: relative;
    left: 0;
    margin: 0;
  }
`;

const Headline = styled.h3`
  z-index: 1;
  font-weight: 500;
  font-size: 2.2rem;
  line-height: 3rem;
  position: relative;
  top: 2rem;
  left: -150px;

  @media only screen and (max-width: 480px) {
    left: 0;
    top: 0;
    margin: 0.5rem 0 0;
    font-size: 1.3rem;
    line-height: 1.8rem;
  }
`;

const Body = styled.div<{ height: number; aspectRatio: number }>`
  z-index: 1;
  font-weight: 500;
  font-size: 1.3rem;
  line-height: 2rem;
  margin: 3rem 2rem 0 2rem;

  @media only screen and (max-width: 480px) {
    margin: 1rem 0 1rem;
    font-size: 1.1rem;
    line-height: 1.5rem;
  }
`;

const BackgroundImage = ({
  height,
  aspectRatio,
  imageProps,
}: {
  height: number;
  aspectRatio: number;
  imageProps: UseNextSanityImageProps;
}) => (
  <ImageWrapper height={height} aspectRatio={aspectRatio}>
    <NextImage {...imageProps} layout="responsive" placeholder="blur" />
  </ImageWrapper>
);

const Bio = (props: Props<ResolvedBio>) => {
  const { data } = useData<ResolvedBio>(getBio, "bio");
  const { headline, body, image } = (data || props.data) ?? (EMPTY_OBJECT as ResolvedBio);
  const isMobile = useIsMobile();

  const height = useImageHeight(image);
  const imageProps = useNextSanityImage(sanityClient, image?.asset ?? {});
  const aspectRatio = image?.asset?.metadata?.dimensions?.aspectRatio ?? 1;

  if (!headline || !body) return null;

  return (
    <Layout projects={props.projects} email={props.email} footerAlwaysVisible>
      <Wrapper>
        {!isMobile && <BackgroundImage height={height} aspectRatio={aspectRatio} imageProps={imageProps} />}
        <TextWrapper height={height} aspectRatio={aspectRatio}>
          <Headline>{headline}</Headline>
          {isMobile && <BackgroundImage height={height} aspectRatio={aspectRatio} imageProps={imageProps} />}
          <Body height={height} aspectRatio={aspectRatio}>
            {body}
          </Body>
        </TextWrapper>
      </Wrapper>
    </Layout>
  );
};

export default Bio;
