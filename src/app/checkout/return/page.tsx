import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Link from "next/link";
import { redirect } from "next/navigation";
// const products = [
//   {
//     id: 1,
//     name: "Distant Mountains Artwork Tee",
//     price: "$36.00",
//     description:
//       "You awake in a new, mysterious land. Mist hangs low along the distant mountains. What does it mean?",
//     address: ["Floyd Miles", "7363 Cynthia Pass", "Toronto, ON N3Y 4H8"],
//     email: "f•••@example.com",
//     phone: "1•••••••••40",
//     href: "#",
//     status: "Processing",
//     step: 1,
//     date: "March 24, 2021",
//     datetime: "2021-03-24",
//     imageSrc:
//       "https://tailwindui.com/img/ecommerce-images/confirmation-page-04-product-01.jpg",
//     imageAlt:
//       "Off-white t-shirt with circular dot illustration on the front of mountain ridges that fade.",
//   },
//   // More products...
// ];
async function getSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId!);
  return session;
}

export default async function CheckoutReturn(
  props: {
    searchParams: Promise<{ session_id: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const sessionId = searchParams.session_id;
  const session = await getSession(sessionId);
  // console.log(session);
  if (!session) {
    redirect("/");
  }

  if (session?.status === "open") {
    return (
      <div className="flex h-screen w-full flex-col gap-2 py-4">
        <h1 className="text-5xl font-bold text-red-500">
          Payment did not work.
        </h1>

        <Button asChild className="w-fit" variant="outline" size="sm">
          <Link href="/checkout">Try Again</Link>
        </Button>
      </div>
    );
  }

  // if (session?.status === "complete") {
  //   return (
  //     <div className="flex h-screen w-full flex-col gap-2 py-4">
  //       <h1 className="text-5xl font-bold text-green-500">Payment worked.</h1>
  //       <p>
  //         We love doing business with you! Your Stripe customer ID is:
  //         {session.customer as string}.
  //       </p>
  //     </div>
  //   );
  // }

  if (session?.status === "complete") {
    const order = await prisma.order.findFirst({
      where: {
        userId: session.metadata?.user_id,
      },
      select: {
        id: true,
        shippingAddress: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            product: {
              select: {
                id: true,
                images: { select: { url: true } },
                name: true,
                description: true,
                price: true,
                vendor: {
                  select: {
                    id: true,
                    imageURL: true,
                    name: true,
                  },
                },
              },
            },
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!order) {
      return (
        <div className="flex h-screen w-full flex-col gap-2 py-4">
          <h1 className="text-5xl font-bold text-red-500">
            Something went wrong.
          </h1>
          <p className="text-2xl font-bold">contact support.</p>
        </div>
      );
    }

    return (
      <div className="flex h-screen w-full flex-col gap-2 py-4">
        <h1 className="text-5xl font-bold text-green-500">
          Payment Successful.
        </h1>
        <p className="text-2xl font-bold">
          Your stripe costumer ID: {session.customer?.toString()}
        </p>

        <Button asChild className="mt-2 w-fit" variant="outline" size="sm">
          <Link href={`/order/${order.id}`}>Track Order</Link>
        </Button>
      </div>
    );
  }

  return null;
}
