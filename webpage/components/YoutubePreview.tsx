import { useMemo } from "react";
import getYouTubeId from "get-youtube-id";
import YouTube from "react-youtube";
import styled from "styled-components";

const Wrapper = styled.div<{ moveUp?: boolean; single?: boolean }>`
  display: inline-block;
  margin-right: 1.5rem;

  ${({ single }) =>
    single &&
    `
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;

  & > div:first-child {
    flex-grow: 1;
    aspect-ratio: 16 / 9;
  }
  `}

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
  single?: boolean;
};

const YoutubePreview = ({ url, moveUp, single }: Props) => {
  const options = useMemo(() => (single ? { height: "100%", width: "100%" } : {}), [single]);

  if (!url) return null;

  const id = getYouTubeId(url) ?? undefined;

  if (!id) {
    console.error(`Could not get id for Youtube preview with url ${url}`);
    return null;
  }

  return (
    <Wrapper moveUp={moveUp} single={single}>
      <YouTube videoId={id} opts={options} />
    </Wrapper>
  );
};

export default YoutubePreview;
