import { Button } from "@/components/ui/button";
import Link from "next/link";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: { vendor: { include: { products: true } } },
  });
  if (!user!.vendor) redirect("/dashboard/#become-vendor");

  const { products } = user!.vendor!;
  return (
    <div className="h-fit overflow-x-clip px-5">
      <h1 className="me-auto text-4xl font-black">Your Products</h1>
      <div className="container px-0 py-10">
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  );
}
