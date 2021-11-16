import { useEffect, useState } from "react";
import styled from "styled-components";
import { useWindowSize } from "react-use";

import { ResolvedImage } from "../types";
import isServer from "../utils/isServer";
import Image from "./Image";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const CenteredImage = styled(Image)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: auto;
`;

type Props = {
  images: ResolvedImage[];
  onClick?: (id?: string) => void;
  maxHeight?: number;
};

// TODO: secondImage
const ImageMasonry = ({ images, onClick }: Props) => {
  return (
    <Wrapper>
      {images?.map((image, idx) => (
        <CenteredImage
          key={image?.ownerId ?? `image-${idx}`}
          image={image}
          width={50}
          gap="0.5rem"
          onClick={onClick}
        />
      ))}
    </Wrapper>
  );
};

export default ImageMasonry;
