import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function Dashboard() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: { vendor: true },
  });
  if (!user) redirect("/sign-in");

  return (
    <div className="h-fit overflow-x-clip px-5">
      <div className="mb-10 flex gap-1">
        <h1 className="self-start text-4xl font-black">Profile</h1>
        <Button asChild className="self-end font-semibold" variant="link">
          <Link href={`/u/${user.id}`}>Profile Page</Link>
        </Button>
      </div>
      <ProfileForm user={user} />
      {user && !user.vendor && (
        <>
          <Separator className="my-5 w-5/6 self-center" />
          <h3 className="mb-1 text-2xl font-semibold">Become a Vendor</h3>
          <p className="mb-5 max-w-2xl text-zinc-700 dark:text-zinc-300">
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
