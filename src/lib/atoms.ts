import { LocalShoppingCartItem, LocalShoppingCartItems } from "@/lib/types";
import { atomWithStorage } from "jotai/utils";

export const cartAtom = atomWithStorage<LocalShoppingCartItems>(
  "shoppingCart",
  {}
);
