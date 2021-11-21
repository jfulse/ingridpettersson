import { createContext } from "react";

import { ResolvedProduct } from "../types";

export type ShoppingCart = {
  items: ResolvedProduct[];
};

export type ContextType = {
  shoppingCart: ShoppingCart;
  successMetadata?: object;
};

export type ContextValue = [ContextType, (newContext: ContextType) => void];

export const INITIAL_CONTEXT = {
  shoppingCart: { items: [] },
};

export default createContext<ContextValue>([INITIAL_CONTEXT, () => null]);
