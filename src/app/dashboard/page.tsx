import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: { vendor: true },
  });

  return (
    <>
      <h1 className="me-auto self-start text-4xl font-black">Dashboard</h1>
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
        <Link href="/sellers/register" className="mx-auto">
          <Button variant="default">Become a seller</Button>
        </Link>
      )}
    </>
  );
}
