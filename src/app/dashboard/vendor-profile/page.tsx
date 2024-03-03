import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import VendorProfileForm from "./VendorProfileForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, MoveUpRight } from "lucide-react";

export default async function Page() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email!,
    },
    include: { vendor: true },
  });
  if (!user) redirect("/sign-in");
  const vendor = user.vendor;
  if (!vendor) redirect("/dashboard/#become-vendor");
  return (
    <div className="h-fit overflow-x-clip px-5">
      <h1 className="mb-10 me-auto self-start text-4xl font-black">
        Vendor Profile
        <Button asChild variant="link">
          <Link
            className="mx-0 mb-4 px-0 text-sm font-medium text-opacity-80"
            href={`/vendors/${vendor.id}`}
          >
            Vendor Page
            <ArrowUpRight className="ms-1 h-4 w-4" />
          </Link>
        </Button>
      </h1>

      <VendorProfileForm vendor={vendor} />
    </div>
  );
}
