import { type ClassValue, clsx } from "clsx";
import { auth } from "@/server/auth";
import { twMerge } from "tailwind-merge";
import { prisma } from "./db";
import { LocalShoppingCartItems } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function abbrNum(number: number, decPlaces: number) {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces);

  // Enumerate number abbreviations
  let abbrev = ["k", "m", "b", "t"];

  // Go through the array backwards, so we do the largest first
  let abbreviatedNum: string = "";
  for (let i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    let size = Math.pow(10, (i + 1) * 3);

    // If the number is bigger or equal do the abbreviation
    if (size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round((number * decPlaces) / size) / decPlaces;

      // Handle special case where we round up to the next abbreviation
      if (number == 1000 && i < abbrev.length - 1) {
        number = 1;
        i++;
      }

      // Add the letter for the abbreviation
      abbreviatedNum = number + abbrev[i];

      // We are done... stop
      break;
    }
  }

  return abbreviatedNum || number;
}

// checks wether current user is logged in and wether the same with the one who sent the request.
export async function checkAuth(userId: string) {
  const session = await auth();
  if (!session || !session.user)
    return { success: false, cause: "User is not authenticated." };
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, cause: "User doesn't exist." };
  if (user.email !== session.user.email)
    return {
      success: false,
      cause: "User who made the request isn't the same as the user logged in.",
    };
  return { success: true, cause: "" };
}

// export const formatPrice = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "USD",
//   minimumFractionDigits: 0,
// }).format;

export function formatPrice(num: number | bigint) {
  const formattedNum = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(num);
  return formattedNum.slice(1);
}

export function MergeCartItems(
  itemsFromServer: LocalShoppingCartItems,
  itemsFromClient: LocalShoppingCartItems,
  prioritize: "client" | "server" = "server",
) {
  const mergedItems = { ...itemsFromServer };
  for (const itemKey in itemsFromClient) {
    const itemFromMap = mergedItems[itemKey];
    if (itemFromMap) {
      if (prioritize === "client") {
        mergedItems[itemKey] = itemsFromClient[itemKey];
      }
    } else {
      mergedItems[itemKey] = itemsFromClient[itemKey];
    }
  }

  return mergedItems;
}
