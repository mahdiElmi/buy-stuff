"use server";

import { utapi } from "uploadthing/server";

// await utapi.deleteFiles("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg");
// await utapi.deleteFiles([
//   "2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg",
//   "1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg",
// ]);

export async function setThemeCookie(imageId: string) {
  console.log(imageId);
  const idk = await utapi.deleteFiles(imageId);
  console.log(idk);
}
