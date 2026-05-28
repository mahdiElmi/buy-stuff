import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import VendorProfileForm from "./VendorProfileForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Profile",
};

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/sign-in");
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: { vendor: true },
  });
  if (!user) redirect("/sign-in");
  const vendor = user.vendor;
  if (!vendor) redirect("/dashboard/#become-vendor" as any);

  return (
    <div className="h-fit overflow-x-clip px-5">
      <h1 className="me-auto mb-10 self-start text-4xl font-black">
        Vendor Profile
        <Button asChild variant="link">
          <Link
            className="text-opacity-80 mx-0 mb-4 px-0 text-sm font-medium"
            href={`/vendors/${vendor.id}`}
          >
            Vendor Page
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </Button>
      </h1>

      <VendorProfileForm vendor={vendor} />
    </div>
  );
}
