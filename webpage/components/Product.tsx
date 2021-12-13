import styled from "styled-components";

import { ResolvedImage } from "../types";
import Image from "./Image";
import Link from "./Link";

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > div:first-child {
    width: 100%;
    height: 100%;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.3s ease-in;

  &:hover {
    opacity: 0.6;
    transition: opacity 0.3s ease-out;

    @media only screen and (max-width: 480px) {
      opacity: unset;
    }
  }

  @media only screen and (max-width: 480px) {
    & > div:first-child {
      width: 100%;
      height: unset;
    }
  }
`;

const Info = styled.div`
  text-align: center;

  h4 {
    margin: 1rem 0 0.5rem;
  }

  & > div:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

type Props = {
  id: string;
  image?: ResolvedImage;
  title: string;
  price: number;
  href: string;
  category?: string;
};

const Product = (props: Props) => {
  const { image, title, price, href, category } = props;

  return (
    <StyledLink href={href}>
      <Wrapper>
        {image && <Image image={image} height={50} />}
        <Info>
          <h4>{title}</h4>
          {category && <div>{category}</div>}
          <div>{price} NOK</div>
        </Info>
      </Wrapper>
    </StyledLink>
  );
};

export default Product;
