import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function Home() {
  // const vendor = await prisma.vendor.findFirst({
  //   where: { name: "Boxy Town" },
  // });
  // for (let i = 0; i < 20; i++) {
  //   await prisma.product.create({
  //     data: {
  //       name: `box ${i}`,
  //       description: "big box",
  //       price: 10,
  //       stock: 5,
  //       vendorId: vendor!.id,
  //     },
  //   });
  // }
  return (
    <section className="flex h-full flex-col items-center justify-center gap-5 ">
      <h1 className="w-fit text-8xl font-black underline decoration-red-500 decoration-8">
        BUY STUFF
      </h1>
      <p className="max-w-5xl text-center text-3xl font-medium">
        Yes you heard it right you can{" "}
        <span className="font-extrabold text-violet-400">BUY STUFF</span> here.
        uhum, take a deep breath, no you are not dreaming :) that&apos;s us. We
        give <span className="font-extrabold text-violet-400">YOU</span> the
        power to BUY STUFF. So what are you waiting for?? get on over to buy
        stuff and buy stuff 😉👍
      </p>
      <Link
        href="/products"
        className="rounded-sm bg-emerald-600 p-1 text-center text-3xl font-medium hover:invert"
      >
        START BUYING
      </Link>
    </section>
  );
}
