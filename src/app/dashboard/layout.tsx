import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

async function layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: { vendor: true },
  });

  return (
    <div className="mx-2 my-5 flex h-fit min-h-screen w-full max-w-8xl flex-row gap-5 self-start rounded-md border-2 bg-zinc-100 pt-4 shadow dark:border-zinc-700 dark:bg-zinc-950 dark:from-zinc-900 dark:to-zinc-950 md:to-30% md:dark:bg-gradient-to-r ">
      <nav className="hidden h-full w-1/5 flex-col gap-2 md:flex ">
        <h2 className="px-2 text-center text-2xl font-black">Dashboard</h2>
        <Separator className="w-5/6 self-center" />
        <Button
          className="flex w-full justify-start text-xl font-bold hover:bg-zinc-200"
          variant="ghost"
          asChild
        >
          <Link href="/dashboard">Profile</Link>
        </Button>
        <Button
          className="flex w-full justify-start text-xl font-bold hover:bg-zinc-200"
          variant="ghost"
          asChild
        >
          <Link href="/dashboard/favorites">Favorites</Link>
        </Button>
        {/* <Link href="/dashboard/purchase-history">
          <Button
            className="flex w-full justify-start text-xl font-bold hover:bg-zinc-200"
            variant="ghost"
          >
            Purchase History
          </Button>
        </Link>
        <Link href="/dashboard/lists">
          <Button
            className="flex w-full justify-start text-xl font-bold hover:bg-zinc-200"
            variant="ghost"
          >
            Lists
          </Button>
        </Link> */}
        {user && user.vendor && (
          <>
            <h2 className=" text-center text-2xl font-black text-emerald-500">
              Sell Stuff
            </h2>
            <Separator className="w-5/6 self-center" />
            <Link href={`/dashboard/vendor-profile`}>
              <Button
                className="flex w-full justify-start text-xl font-bold"
                variant="ghost"
              >
                Vendor Profile
              </Button>
            </Link>
            <Link href={`/dashboard/vendor-products`}>
              <Button
                className="flex w-full justify-start text-xl font-bold"
                variant="ghost"
              >
                Your Products
              </Button>
            </Link>
          </>
        )}
      </nav>
      {/* <section className="h-full max-h-fit w-full self-start overflow-x-auto bg-yellow-950 px-3 ps-8 "> */}
      {children}
      {/* </section> */}
    </div>
  );
}

export default layout;
