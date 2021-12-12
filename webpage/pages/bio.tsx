import styled, { css } from "styled-components";
import NextImage from "next/image";
import { useNextSanityImage } from "next-sanity-image";

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

export const getStaticProps = makeGetStaticProps(getBio);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem;
  line-height: 1.5rem;
  height: 100%;
  overflow-y: auto;
  position: relative;
`;

const BORDER_REM = FOOTER_HEIGHT_REM + HEADER_HEIGHT_REM;

const ImageWrapper = styled.div<{ height: number; aspectRatio: number }>`
  position: absolute;
  left: 0;
  top: 0;
  ${({ aspectRatio, height }) => `
  height: calc(${height}vh - ${BORDER_REM}rem);
  width: calc(${height * aspectRatio}vh - ${BORDER_REM * aspectRatio}rem);
  `}

  @media only screen and (max-width: 480px) {
    width: 100%;
    height: unset;
    position: relative;
  }
`;

const textShadowColor = "rgba(255, 255, 255, 0.3)";
const textShadow = css`-3px -3px 20px ${textShadowColor}, 3px -3px 20px ${textShadowColor}, -3px 3px 20px ${textShadowColor}, 3px 3px 20px ${textShadowColor}`;

const Headline = styled.h3`
  z-index: 1;
  font-weight: 500;
  font-size: 2rem;
  line-height: 2.5rem;
  margin: 10% 0 0 5%;
  text-shadow: ${textShadow};

  @media only screen and (max-width: 480px) {
    position: absolute;
    font-size: 1.4rem;
    line-height: 1.8rem;
    margin: 1rem 2rem;
  }
`;

const Body = styled.div`
  z-index: 1;
  margin: 5% 0 0 15%;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 2rem;
  text-shadow: ${textShadow};

  @media only screen and (max-width: 480px) {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5rem;
  }
`;

const Bio = (props: Props<ResolvedBio>) => {
  const { data } = useData<ResolvedBio>(getBio, "bio");
  const { headline, body, image } = (data || props.data) ?? (EMPTY_OBJECT as ResolvedBio);

  const height = useImageHeight(image);
  const imageProps = useNextSanityImage(sanityClient, image?.asset ?? {});
  const aspectRatio = image?.asset?.metadata?.dimensions?.aspectRatio;

  if (!headline || !body) return null;

  return (
    <Layout projects={props.projects}>
      <Wrapper>
        {aspectRatio && (
          <ImageWrapper height={height} aspectRatio={aspectRatio}>
            <NextImage {...imageProps} layout="responsive" placeholder="blur" />
          </ImageWrapper>
        )}
        <Headline>{headline}</Headline>
        <Body>{body}</Body>
      </Wrapper>
    </Layout>
  );
};

export default Bio;
