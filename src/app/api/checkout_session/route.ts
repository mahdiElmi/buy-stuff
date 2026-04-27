import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userSession = await auth();
    if (!userSession) {
      return NextResponse.json(
        { message: "User is not logged in" },
        { status: 500 },
      );
    }

    const cartItems = await prisma.shoppingCartItem.findMany({
      where: {
        userId: userSession.user!.id!,
      },
      select: {
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            images: { select: { url: true }, take: 1 },
          },
        },
      },
    });

    if (cartItems.length <= 0) {
      return NextResponse.json({ message: "Cart is empty." }, { status: 500 });
    }

    const { priceId, quantity } = await request.json();
    const query = cartItems.reduce((prev, currentValue, i) => {
      return (
        prev +
        `metadata["product_id"]:"${currentValue.product.id}" ${i < cartItems.length - 1 ? "OR " : ""}`
      );
    }, "");
    console.log("-------------STRIPE QUERY-------------", query);
    const StripeProducts = await stripe.products.search({
      query,
    });
    // console.log(
    //   "-------------STRIPE QUERY RESULT-------------",
    //   StripeProducts,
    // );

    if (StripeProducts.data.length < cartItems.length) {
      console.log(
        "-------------NOT ALL PRODUCTS ARE REGISTERED ON STRIPE-------------",
      );
      const productIds = new Set(
        StripeProducts.data.map(
          (stripeProduct) => stripeProduct.metadata.product_id,
        ),
      );
      const filteredItems = cartItems.filter(
        (item) => !productIds.has(item.product.id),
      );
      console.log(
        "-------------Filtered STRIPE PRODUCT IDS (THE ONES NOT REGISTERED)-------------",
        filteredItems,
        "=======AMOUNT========",
        filteredItems.length,
      );
      for (let cartItem of filteredItems) {
        // const [price, decimal] = cartItem.product.price.toString().split(".");
        const createdProduct = await stripe.products.create({
          name: cartItem.product.name,
          description: cartItem.product.description,
          images: [cartItem.product.images[0].url],
          metadata: {
            product_id: cartItem.product.id,
          },
          default_price_data: {
            currency: "USD",
            unit_amount_decimal: cartItem.product.price.toString(),
          },
        });
        console.log("created this bitch", createdProduct);
      }
    }
    const session = await stripe.checkout.sessions.create({
      metadata: {
        user_id: userSession.user!.id!,
      },
      customer_email: userSession.user!.email!,
      ui_mode: "embedded",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: "payment",
      return_url: `${request.headers.get("origin")}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
