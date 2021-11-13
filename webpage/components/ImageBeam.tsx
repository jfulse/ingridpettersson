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
  height?: number;
};

const ImageBeam = ({ images, height = 60 }: Props) => {
  return (
    <Wrapper>
      {images?.map((image) => (
        <Image key={image?._id} image={image} height={height} />
      ))}
    </Wrapper>
  );
};

export default ImageBeam;
