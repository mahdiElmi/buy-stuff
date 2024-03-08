"use server";

import { prisma } from "@/lib/db";
import { utapi } from "@/server/uploadthing";

export default async function deleteImage(imageUrl: string) {
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
