// @ts-ignore
import React from "react"; // eslint-disable-line no-use-before-define
import getYouTubeId from "get-youtube-id";
import YouTube from "react-youtube";
import styled from "styled-components";

// TOOD: Fix display on mobile

const Wrapper = styled.div<{ moveUp?: boolean }>`
  display: inline-block;
  margin-right: 1.5rem;

  ${({ moveUp }) =>
    moveUp &&
    `
  & > div:first-child {
    position: relative;
    bottom: 5rem;
  }`}
`;

type Props = {
  url?: string;
  moveUp?: boolean;
};

const YoutubePreview = ({ url, moveUp }: Props) => {
  if (!url) return null;

  const id = getYouTubeId(url) ?? undefined;

  if (!id) {
    console.error(`Could not get id for Youtube preview with url ${url}`);
    return null;
  }

  return (
    <Wrapper moveUp={moveUp}>
      <YouTube videoId={id} />
    </Wrapper>
  );
};

export default YoutubePreview;
