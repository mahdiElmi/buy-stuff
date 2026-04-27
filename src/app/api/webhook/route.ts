import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  console.log("STARTINGGGGGGG");
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error: any) {
      console.log(
        `Webhook failed. Signature doesn't match error: ${error.message}`,
      );
      return NextResponse.json({ message: "Webhook Error!" }, { status: 500 });
    }
    console.log("---------------EVENT-------------", event);
    if (event.type === "checkout.session.completed") {
      console.log(
        "CUSTOMER IDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        event.data.object.customer,
      );

      const session: Stripe.Checkout.Session = event.data.object;
      const userId = session.metadata!.user_id;
      console.log("!!!!!!!!!!!!!!USERID!!!!!!!!!!!!!!!!", userId);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          defaultShippingAddress: true,
          shoppingCartItems: true,
        },
      });
      if (!user) {
        console.log("user does not exist");
        throw new Error("user has no default Shipping address");
      }

      // const [items, shippingAddress] = await prisma.$transaction([
      //   prisma.shoppingCartItem.findMany({
      //     where: { userId },
      //   }),
      //   prisma.shippingAddress.findUnique({
      //     where: {
      //       id: authSession.user.defaultShippingAddressId,
      //     },
      //   }),
      // ]);

      if (!user.defaultShippingAddress)
        throw new Error("user has no default Shipping address");

      const { id, createdAt, updatedAt, ...restOfShippingAddress } =
        user.defaultShippingAddress;

      const [deleteResult, order] = await prisma.$transaction([
        prisma.shoppingCartItem.deleteMany({
          where: {
            userId,
          },
        }),
        prisma.order.create({
          data: {
            buyer: { connect: { id: userId } },
            total: session.amount_total!,
            shippingAddress: {
              create: {
                ...restOfShippingAddress,
              },
            },
            items: {
              createMany: {
                data: user.shoppingCartItems.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                })),
              },
            },
          },
        }),
      ]);

      console.log(deleteResult.count, "deleted");
    }
    return NextResponse.json({ message: "success" });
  } catch (error: any) {
    console.log("------error--------", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
