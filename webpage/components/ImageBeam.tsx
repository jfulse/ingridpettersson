import styled from "styled-components";

import { ResolvedImage } from "../types";
import Image from "./Image";

const Wrapper = styled.div`
  width: 100%;
  overflow: auto;
  white-space: nowrap;
`;

type Props = {
  images: ResolvedImage[];
  onClick?: (id?: string) => void;
  height?: number;
};

const ImageBeam = ({ images, onClick, height = 60 }: Props) => {
  return (
    <Wrapper>
      {images?.map((image) => (
        <Image
          key={image?.ownerId}
          image={image}
          height={height}
          onClick={onClick}
        />
      ))}
    </Wrapper>
  );
};

export default ImageBeam;
