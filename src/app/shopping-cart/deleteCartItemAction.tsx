// "use server";

// import { prisma } from "@/lib/db";
// import { checkAuth } from "@/lib/utils";

// export default async function deleteItemFromCart(
//   userId: string,
//   productId: string,
// ) {
//   const { success, cause } = await checkAuth(userId);
//   if (!success) return { success, cause };

//   try {
//     await prisma.shoppingCartItem.delete({
//       where: { productId_userId: { productId, userId } },
//     });
//     return { success: true, cause: "" };
//   } catch (error) {
//     return { success: false, cause: "Database error." };
//   }
// }
