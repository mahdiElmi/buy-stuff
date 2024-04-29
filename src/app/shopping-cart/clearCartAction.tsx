// "use server";

// import { prisma } from "@/lib/db";
// import { checkAuth } from "@/lib/utils";

// export default async function clearCart(userId: string) {
//   const { success, cause } = await checkAuth(userId);
//   if (!success) return { success, cause };

//   try {
//     await prisma.shoppingCartItem.deleteMany({
//       where: { userId: userId },
//     });
//     return { success: true, cause: "" };
//   } catch (error) {
//     return { success: false, cause: "Database error." };
//   }
// }
