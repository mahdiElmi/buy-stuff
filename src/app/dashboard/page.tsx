import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { SquareArrowOutUpRight } from "lucide-react";
import ShippingAddresses from "./ShippingAddresses";

export default async function Dashboard() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: {
      vendor: true,
      shippingAddresses: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!user) redirect("/sign-in");

  return (
    <div className="h-fit w-full px-5 pb-5 md:ps-0">
      <div className="mb-10 flex items-center gap-2">
        <h1 className="self-start text-4xl font-black">Profile</h1>
        <Link className="self-start pt-1" href={`/u/${user.id}`}>
          <SquareArrowOutUpRight className="size-4" />
          <span className="sr-only">Profile Link</span>
        </Link>
      </div>
      <div className="grid auto-rows-auto gap-4 lg:grid-cols-[repeat(2,_auto)] lg:divide-x-2 lg:divide-zinc-500/10">
        <ProfileForm user={user} />
        <div className="flex min-w-0 max-w-full flex-col gap-5 lg:pe-5 lg:ps-8">
          <h2 className="text-2xl font-bold">Shipping Addresses</h2>
          <ShippingAddresses user={user} />
        </div>
      </div>
      {user && !user.vendor && (
        <>
          <Separator className="my-5 w-full self-center" />
          <h3 className="mb-1 text-2xl font-semibold">Become a Vendor</h3>
          <p className="mb-5 max-w-2xl text-pretty text-zinc-700 dark:text-zinc-300">
            We&apos;re always looking for new vendors to join our marketplace.
            If you have a great product or service to sell, we want to hear from
            you! Becoming a vendor is easy and free. Simply click the button
            below to apply.
          </p>
          <Button asChild id="become-vendor" variant="outline">
            <Link href="/vendors/register" className="mx-auto font-bold">
              Register as a Vendor
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
