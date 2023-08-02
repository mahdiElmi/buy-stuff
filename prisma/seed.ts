import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // const clothing = await prisma.category.upsert({
  //   where: { name: "clothing" },
  //   update: {},
  //   create: {
  //     name: "clothing",
  //     description: "any piece of clothing",
  //   },
  // });
  const vibrod = await prisma.vendor.upsert({
    where: {
      name: "Vibrod Prod tm",
    },
    update: {},
    create: {
      name: "Vibrod Prod tm",
      description: "we make vibrators ok? deal with it",
    },
  });
  const vibrator = await prisma.product.upsert({
    where: { id: "a" },
    update: {},
    create: {
      id: "a",
      averageRating: 0,
      name: "Vibrat pro",
      description:
        "the best vibrator in the town two times Vibcon winner of best vibrator of the year and certified to deliver orgasm level of 10 or higher. Squirt, piss, semen proof this vibrator can handle all the 4 vaginal fluids and penile fluids with ease.enterprise anti poop coating to keep the vibrator clean from 99.6% of bacteria found it human and dog feces. tested to go 20 inches deep*. *it is recommended to attach our fiber mesh band to the vibrator when going deep to prevent the good old pooping the vibrator out.",
      price: 699,
      stock: 7,
      vendor: {
        connect: {
          id: vibrod.id,
        },
      },
    },
  });
  const mahdi = await prisma.user.upsert({
    where: { email: "mahdi@gmail.com" },
    update: {},
    create: {
      email: "mahdi@gmail.com",
      firstName: "Mahdi",
      lastName: "Elmi",
      reviews: {
        create: {
          title:
            "the product that cured my hemorrhoid or how I stopped excreting painfully and started loving toilets again.",
          body: "oh I like this product you have no Idea! haha it's a bit pricy but oh boy.. can you put a price on butt pain? :)) I mean... come on!! haha",
          rating: 5,
          productId: vibrator.id,
        },
      },
    },
  });
  console.log(mahdi, vibrator, vibrod);
  const vibPorducts = await prisma.product.findMany({
    where: { name: "vibrat pro" },
    include: { reviews: true },
  });
  console.log(vibPorducts);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
