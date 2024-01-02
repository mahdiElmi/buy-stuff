import { prisma } from "@/lib/db";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

async function layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: { vendor: true },
  });

  return (
    <div className="flex h-screen w-full max-w-7xl flex-row gap-5 self-start rounded-t-md border-2 border-b-0 bg-zinc-100 to-30% pt-5 shadow dark:border-zinc-700 dark:bg-gradient-to-r dark:from-zinc-900 dark:to-zinc-950 ">
      <nav className="flex h-full w-1/5 flex-col gap-2 ">
        <h2 className=" text-center text-2xl font-black">Buy Stuff</h2>
        <Separator className="w-5/6 self-center" />
        <Link href="/dashboard">
          <Button
            className="flex w-full justify-start text-xl font-semibold"
            variant="ghost"
          >
            Profile
          </Button>
        </Link>
        <Link href="/dashboard/favorites">
          <Button
            className="flex w-full justify-start text-xl font-semibold"
            variant="ghost"
          >
            Favorites
          </Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button
            className="flex w-full justify-start text-xl font-semibold"
            variant="ghost"
          >
            Settings
          </Button>
        </Link>
        {user && user.vendor && (
          <>
            <h2 className=" text-center text-2xl font-black text-emerald-500">
              Sell Stuff
            </h2>
            <Separator className="w-5/6 self-center" />
            <Link href={`/vendors/${user.vendor.id}`}>
              <Button
                className="flex w-full justify-start text-xl font-semibold"
                variant="ghost"
              >
                Vendor Page
              </Button>
            </Link>
          </>
        )}
      </nav>
      <section className="h-full w-full max-w-7xl self-start ">
        {children}
      </section>
    </div>
  );
}

export default layout;
