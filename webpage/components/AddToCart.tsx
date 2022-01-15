import { useCallback } from "react";
import styled from "styled-components";

import useShoppingCart from "../hooks/useShoppingCart";
import { ResolvedProduct } from "../types";
import Button from "./Button";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 0.25rem;

  button {
    font-size: 1.3rem;
    line-height: 1.3rem;
  }
`;

type Props = { product: ResolvedProduct; color?: string; backgroundColor?: string };

const AddToCart = ({ product, color, backgroundColor }: Props) => {
  const { countInCart, addToCart, removeFromCart } = useShoppingCart();
  const inShoppinCart = countInCart(product);

  const onClickAddToCart = useCallback(() => {
    addToCart(product);
  }, [addToCart, product]);

  const onClickRemoveFromCart = useCallback(() => {
    removeFromCart(product);
  }, [removeFromCart, product]);

  if (!product) return null;

  return (
    <Wrapper>
      {!inShoppinCart && (
        <Button onClick={onClickAddToCart} color={color} backgroundColor={backgroundColor}>
          Add to cart
        </Button>
      )}
      {Boolean(inShoppinCart) && (
        <Button as="a" href="/checkout" color={color} backgroundColor={backgroundColor}>
          Checkout
        </Button>
      )}
      {Boolean(inShoppinCart) && `In cart: ${inShoppinCart}`}
      {Boolean(inShoppinCart) && (
        <ButtonsWrapper>
          <Button onClick={onClickRemoveFromCart} color={color} backgroundColor={backgroundColor}>
            -
          </Button>
          <Button onClick={onClickAddToCart} color={color} backgroundColor={backgroundColor}>
            +
          </Button>
        </ButtonsWrapper>
      )}
    </Wrapper>
  );
};

export default AddToCart;
