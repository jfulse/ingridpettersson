import { createContext } from "react";

import { ResolvedAddress, ResolvedProduct } from "../types";

export type ShoppingCart = {
  items: ResolvedProduct[];
  successMetadata?: { shipping?: { address: ResolvedAddress; name: string }; receipt_email?: string };
};

export type ContextType = {
  shoppingCart: ShoppingCart;
};

export type ContextValue = [ContextType, (newContext: ContextType) => void];

export const INITIAL_CONTEXT = {
  shoppingCart: { items: [] },
};

export default createContext<ContextValue>([INITIAL_CONTEXT, () => null]);
