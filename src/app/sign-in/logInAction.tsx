"use server";

import { signIn } from "@/server/auth";

export default async function logIn(
  provider: "github" | "google",
  callback: string,
) {
  await signIn(provider, { redirectTo: callback });
}
