// @ts-ignore
import React from "react"; // eslint-disable-line no-use-before-define
import getYouTubeId from "get-youtube-id";
import YouTube from "react-youtube";

const WRAPPER_STYLE = { display: "flex", alignItems: "center" };

const TITLE_STYLE = { margin: "auto" };

const PLAYER_OPTS = { height: "100", width: "164" };

const YoutubePreview = ({
  value,
}: {
  value: { url: string; title: string };
}) => {
  const { url, title } = value;
  const id = getYouTubeId(url) ?? undefined;

  if (!id) {
    console.error(`Could not get id for Youtube preview with url ${url}`);
  }

  return (
    <div style={WRAPPER_STYLE}>
      <YouTube videoId={id} opts={PLAYER_OPTS} />
      <span style={TITLE_STYLE}>{title}</span>
    </div>
  );
};

export default YoutubePreview;
