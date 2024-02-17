import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function Dashboard() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: { vendor: true },
  });

  return (
    <>
      <h1 className="mb-10 me-auto self-start text-4xl font-black">Profile</h1>
      {user && user.vendor ? (
        <>
          <h2 className="me-auto mt-5 self-start text-2xl font-medium">
            Your Products
          </h2>
          <Link href="/products/add">
            <Button variant="outline">+ Add Products +</Button>
          </Link>
        </>
      ) : (
        <>
          <Separator className="mb-5 w-5/6 self-center" />
          <h3 className="mb-1 text-2xl font-semibold">Become a Vendor</h3>
          <p className="mb-5 max-w-2xl text-zinc-700 dark:text-zinc-300">
            We&apos;re always looking for new vendors to join our marketplace.
            If you have a great product or service to sell, we want to hear from
            you! Becoming a vendor is easy and free. Simply click the button
            below to apply.
          </p>
          <Button asChild id="become-seller" variant="outline">
            <Link href="/vendors/register" className="mx-auto font-bold">
              Register as a Vendor
            </Link>
          </Button>
        </>
      )}
    </>
  );
}
