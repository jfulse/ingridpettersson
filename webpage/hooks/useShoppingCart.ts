import { useCallback, useEffect, useState } from "react";
import { ShoppingCart } from "../context";
import { ResolvedProduct } from "../types";
import useAppContext from "./useAppContext";

const SHOPPING_CART_KEY = "shopping-cart";

const persistShoppingCart = (shoppingCart: ShoppingCart) => {
  localStorage.setItem(SHOPPING_CART_KEY, JSON.stringify(shoppingCart));
};

const getPersistedShoppingCart = () => {
  const shoppingCart = localStorage.getItem(SHOPPING_CART_KEY);
  return shoppingCart ? JSON.parse(shoppingCart) : undefined;
};

export default () => {
  const [{ shoppingCart }, setContext] = useAppContext();
  const [loading, setLoading] = useState(true);
  const nItems = shoppingCart.items?.length ?? 0;

  const countInCart = useCallback(
    (item: ResolvedProduct) =>
      shoppingCart?.items?.reduce?.((total, { _id }) => (_id === item._id ? total + 1 : total), 0),
    [shoppingCart?.items]
  );

  const setShoppingCart = useCallback(
    (newShoppingCart: ShoppingCart) => {
      setContext({ shoppingCart: newShoppingCart });
      persistShoppingCart(newShoppingCart);
    },
    [setContext]
  );

  const addToCart = useCallback(
    (item: ResolvedProduct) => {
      const newShoppingCart = { ...shoppingCart, items: [...shoppingCart.items, item] };
      setShoppingCart(newShoppingCart);
    },
    [setShoppingCart, shoppingCart]
  );

  const removeFromCart = useCallback(
    (item: ResolvedProduct) => {
      const itemIndex = shoppingCart.items.findIndex(({ _id }) => _id === item._id);

      if (itemIndex === -1) {
        // eslint-disable-next-line no-console
        console.error("Could not remove item from shopping cart: ", item);
        return;
      }

      const newItems = shoppingCart.items.slice();
      newItems.splice(itemIndex, 1);
      const newShoppingCart = { ...shoppingCart, items: newItems };
      setShoppingCart(newShoppingCart);
    },
    [setShoppingCart, shoppingCart]
  );

  const onSuccess = useCallback(
    (successMetadata: object) => {
      const newShoppingCart = { ...shoppingCart, items: [], successMetadata };
      setShoppingCart(newShoppingCart);
    },
    [shoppingCart, setShoppingCart]
  );

  useEffect(() => {
    const persistedShoppingCart = getPersistedShoppingCart();
    if (persistedShoppingCart) setShoppingCart(persistedShoppingCart);
    setLoading(false);
  }, [setShoppingCart]);

  return { shoppingCart, countInCart, addToCart, removeFromCart, onSuccess, nItems, loading };
};
