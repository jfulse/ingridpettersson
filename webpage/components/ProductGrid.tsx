import { ComponentProps } from "react";
import styled from "styled-components";

import Product from "./Product";

// https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  grid-auto-flow: row;
  gap: 2rem 1rem;
  padding: 1rem 1.5rem 0;

  @media only screen and (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
    gap: 1rem 0.25rem;
  }
`;

type Props = {
  imageObjects: ComponentProps<typeof Product>[];
  maxHeight?: number;
};

const ImageGrid = ({ imageObjects }: Props) => {
  return (
    <Wrapper>
      {imageObjects?.map(({ id, image, title, price, href, category }) => (
        <Product key={id} id={id} image={image} price={price} title={title} href={href} category={category} />
      ))}
    </Wrapper>
  );
};

export default ImageGrid;
