import styled from "styled-components";

import { ResolvedImage } from "../types";
import { getColors } from "../style/theme";
import Image from "./Image";

// https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  grid-auto-flow: row;
  margin-top: 1rem;
  gap: 1rem;

  @media only screen and (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 0.25rem;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: auto;
  background-color: ${(props) => getColors(props, "background")};
`;

type Props = {
  images: ResolvedImage[];
  onClick?: (id?: string) => void;
  maxHeight?: number;
};

// TODO: secondImage
const ImageGrid = ({ images, onClick }: Props) => {
  return (
    <Wrapper>
      {images?.map((image, idx) => (
        <ImageWrapper key={image?.ownerId ?? `image-${idx}`}>
          <Image image={image} onClick={onClick} />
        </ImageWrapper>
      ))}
    </Wrapper>
  );
};

export default ImageGrid;
