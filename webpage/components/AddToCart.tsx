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
      <Button onClick={onClickAddToCart} mode="callToAction" color={color} backgroundColor={backgroundColor}>
        Add to cart
      </Button>
      {Boolean(inShoppinCart) && `In cart${inShoppinCart > 1 ? `: ${inShoppinCart}` : ""}`}
      {Boolean(inShoppinCart) && (
        <Button onClick={onClickRemoveFromCart} color={color} backgroundColor={backgroundColor}>
          Remove
        </Button>
      )}
    </Wrapper>
  );
};

export default AddToCart;
