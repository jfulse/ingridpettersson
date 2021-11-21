import { useCallback } from "react";
import styled from "styled-components";

import useShoppingCart from "../hooks/useShoppingCart";
import { ResolvedProduct } from "../types";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Button = styled.button``;

type Props = { product: ResolvedProduct };

const AddToCart = ({ product }: Props) => {
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
      <Button onClick={onClickAddToCart}>Add to cart</Button>
      {Boolean(inShoppinCart) && `In cart${inShoppinCart > 1 ? `: ${inShoppinCart}` : ""}`}
      {Boolean(inShoppinCart) && <Button onClick={onClickRemoveFromCart}>Remove</Button>}
    </Wrapper>
  );
};

export default AddToCart;
