import { authOptions } from "@/server/auth";
import { type ClassValue, clsx } from "clsx";
import { getServerSession } from "next-auth";
import { twMerge } from "tailwind-merge";
import { prisma } from "./db";
import { User } from "@prisma/client";

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
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    return { success: false, cause: "User is not authenticated." };
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, cause: "User doesn't exist." };
  if (user.email !== session.user.email)
    return {
      success: false,
      cause: "User who made the request isn't the same as the user logged in.",
    };
  return { success: true, cause: "", user };
}