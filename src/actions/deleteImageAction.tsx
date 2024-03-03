"use server";

import { prisma } from "@/lib/db";
import { utapi } from "@/server/uploadthing";

// await utapi.deleteFiles("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg");
// await utapi.deleteFiles([
//   "2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg",
//   "1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg",
// ]);

export async function deleteImage(imageUrl: string) {
  console.log(imageUrl);
  const fileKey = imageUrl.split("/f/")[1];
  const result = await utapi.deleteFiles(fileKey);
  if (!result.success) return result;
  try {
    await prisma.image.deleteMany({ where: { url: imageUrl } });
    return result;
  } catch (e) {
    return { success: false };
  }
}

// export async function deleteImages(imageUrls: string[]) {
//   console.log(imageUrls);
//   const result = await utapi.deleteFiles(imageUrls);
//   if (!result.success) return result;
//   try {
//     await prisma.image.deleteMany({ where: { url: imageUrls } });
//     return result;
//   } catch (e) {
//     return { success: false };
//   }
// }
