import styled from "styled-components";

import { ResolvedImage } from "../types";
import useImageHeight from "../hooks/useImageHeight";
import Image from "./Image";
import YoutubePreview from "./YoutubePreview";

// Check if imagebeam can be taller on e.g. project She gets high

const Wrapper = styled.div<{ singleImage?: boolean }>`
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  margin-left: 1.5rem;

  ${({ singleImage }) =>
    singleImage &&
    `
    display: flex;
    justify-content: center;
    margin: 0;
  `}
`;

type Props = {
  imageObjects: { image: ResolvedImage; href?: string }[];
  onClick?: (id?: string) => void;
  maxHeight?: number;
};

// We make sure a maximum of 80% of the first image is shown, to make it obvious
// there is more to the right.
const MAX_IMAGE_VIEW_WIDTH = 80;

const ImageBeam = ({ imageObjects, maxHeight = 80 }: Props) => {
  const height = useImageHeight(imageObjects?.[0]?.image, maxHeight, MAX_IMAGE_VIEW_WIDTH);
  const singleImage = imageObjects?.length < 2;

  return (
    <Wrapper singleImage={singleImage}>
      {imageObjects?.map(({ image, href }, idx) =>
        image._type === "image" ? (
          <Image key={image?._key ?? idx} image={image} height={height} href={href} gap="1.5rem" />
        ) : (
          <YoutubePreview key={image?._key ?? idx} url={image.url} moveUp={!singleImage} />
        )
      )}
    </Wrapper>
  );
};

export default ImageBeam;
