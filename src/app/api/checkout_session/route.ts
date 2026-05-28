import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userSession = await auth();
    if (!userSession?.user?.id) {
      return NextResponse.json(
        { message: "User not logged in" },
        { status: 401 },
      );
    }

    const cartItems = await prisma.shoppingCartItem.findMany({
      where: { userId: userSession.user.id },
      include: { product: { include: { images: { take: 1 } } } },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // Dynamically build line items from the database!
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: item.product.images.map((img) => img.url),
        },
        unit_amount: Math.round(item.product.price * 100), // Stripe uses cents ($10 = 1000)
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      metadata: { user_id: userSession.user.id },
      customer_email: userSession.user.email!,
      ui_mode: "embedded",
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      return_url: `${request.headers.get("origin")}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
