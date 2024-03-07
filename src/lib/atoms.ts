import { LocalShoppingCartItems } from "@/lib/types";
import { atomWithStorage } from "jotai/utils";

export const cartAtom = atomWithStorage<LocalShoppingCartItems>(
  "shoppingCart",
  {},
);

// export const cartAtom = atomWithStorage<LocalShoppingCartItems>(
//   "shoppingCart",
//   localStorage.getItem("shoppingCart") !== null
//     ? JSON.parse(localStorage.getItem("shoppingCart")!)
//     : {},
// );
