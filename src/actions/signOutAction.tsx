"use server";

import { signOut as signOutAuth } from "@/server/auth";

export default async function signOut() {
  await signOutAuth({ redirectTo: "/" });
}
