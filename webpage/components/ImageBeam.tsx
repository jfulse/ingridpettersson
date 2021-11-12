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
};

const ImageBeam = ({ images }: Props) => {
  return (
    <Wrapper>
      {images?.map((image) => (
        <Image key={image?._id} image={image} height={60} />
      ))}
    </Wrapper>
  );
};

export default ImageBeam;
