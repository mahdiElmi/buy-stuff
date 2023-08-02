"use server";

import { cookies } from "next/headers";

export async function setThemeCookie(data: string) {
  if (data === "system") return cookies().delete("theme");
  console.log(data);
  cookies().set("theme", data);
}
