// import { prisma } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { Product, User } from "@prisma/client";

const prisma = new PrismaClient();

type fakeStoreProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
  images: string[];
};

async function main() {
  const deleteReviews = prisma.review.deleteMany();
  const deleteProducts = prisma.product.deleteMany();
  const deleteCategories = prisma.category.deleteMany();
  const deleteVendors = prisma.vendor.deleteMany();
  const deleteUsers = prisma.user.deleteMany();
  const deleteSessions = prisma.session.deleteMany();
  const deleteAccounts = prisma.account.deleteMany();
  await prisma.$transaction([
    deleteReviews,
    deleteProducts,
    deleteVendors,
    deleteUsers,
    deleteSessions,
    deleteAccounts,
    deleteCategories,
  ]);
  // const vibrod = await prisma.vendor.upsert({
  //   where: {
  //     name: "Vibrod Prod tm",
  //   },
  //   update: {},
  //   create: {
  //     name: "Vibrod Prod tm",
  //     description: "we make vibrators ok? deal with it",
  //   },
  // });
  // const vibrator = await prisma.product.upsert({
  //   where: { id: "a" },
  //   update: {},
  //   create: {
  //     id: "a",
  //     averageRating: 0,
  //     name: "Vibrat pro",
  //     description:
  //       "the best vibrator in the town two times Vibcon winner of best vibrator of the year and certified to deliver orgasm level of 10 or higher. Squirt, piss, semen proof this vibrator can handle all the 4 vaginal fluids and penile fluids with ease.enterprise anti poop coating to keep the vibrator clean from 99.6% of bacteria found it human and dog feces. tested to go 20 inches deep*. *it is recommended to attach our fiber mesh band to the vibrator when going deep to prevent the good old pooping the vibrator out.",
  //     price: 699,
  //     stock: 7,
  //     vendor: {
  //       connect: {
  //         id: vibrod.id,
  //       },
  //     },
  //   },
  // });
  // const mahdi = await prisma.user.upsert({
  //   where: { email: "mahdi@gmail.com" },
  //   update: {},
  //   create: {
  //     email: "mahdi@gmail.com",
  //     name: "Mahdi",
  //     lastName: "Elmi",
  //     reviews: {
  //       create: {
  //         title:
  //           "the product that cured my hemorrhoid or how I stopped excreting painfully and started loving toilets again.",
  //         body: "oh I like this product you have no Idea! haha it's a bit pricy but oh boy.. can you put a price on butt pain? :)) I mean... come on!! haha",
  //         rating: 5,
  //         productId: vibrator.id,
  //       },
  //     },
  //   },
  // });
  // console.log(mahdi, vibrator, vibrod);
  // const vibPorducts = await prisma.product.findMany({
  //   where: { name: "vibrat pro" },
  //   include: { reviews: true },
  // });
  // console.log(vibPorducts);

  const fetchResponse = await fetch("https://api.escuelajs.co/api/v1/products");
  const fakeProducts: fakeStoreProduct[] = await fetchResponse.json();

  // fetch and dedupe categories
  const fetchCategoryResponse = await fetch(
    "https://api.escuelajs.co/api/v1/categories",
  );
  const fakeCategories: { id: number; image: string; name: string }[] =
    await fetchCategoryResponse.json();
  const categoryNames = fakeCategories.map((category) => {
    if (category.name === "fsdf") return "Electronics";
    if (category.name === "Okurmen") return "Clothing";
    return category.name;
  });
  const uniqueCategories = Array.from(new Set(categoryNames));

  // create new categories from fake api
  const categoriesToFlush = [];
  for (let categoryName of uniqueCategories) {
    console.log("pooping");
    categoriesToFlush.push(
      prisma.category.create({
        data: {
          name: categoryName,
        },
      }),
    );
  }
  await prisma.$transaction(categoriesToFlush);

  // faker.seed(5);
  let allUsers: User[] = [];

  for (let i = 0; i < 10; i++) {
    console.log(faker.internet.email(), "  ass");
    const createdAtTime = faker.date.past({ years: 3 });
    console.log(createdAtTime, "  ass2");
    const user = await prisma.user.create({
      // where: { id: faker.string.nanoid() },
      // update: {},
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        createdAt: createdAtTime,
        image: faker.internet.avatar(),
        vendor:
          i % 2
            ? {
                create: {
                  name: faker.company.name(),
                  description: faker.lorem.lines({ min: 1, max: 7 }),
                  imageURL: faker.image.urlLoremFlickr({
                    width: 400,
                    height: 400,
                    category: "business",
                  }),
                },
              }
            : undefined,
      },
      include: { vendor: true },
    });

    allUsers.push(user);

    if (i % 2)
      for (let j = 0; j < 12; j++) {
        const currentFakeProduct = fakeProducts[i + j];
        console.log(currentFakeProduct, "fakeeee");
        const currentCategory =
          currentFakeProduct.category.name === "fsdf"
            ? "Electronics"
            : currentFakeProduct.category.name === "Okurmen"
              ? "Clothing"
              : currentFakeProduct.category.name;
        const product = await prisma.product.create({
          // where: { id: faker.string.uuid() },
          // update: {},
          data: {
            name: currentFakeProduct.title,
            price: currentFakeProduct.price,
            description: currentFakeProduct.description,
            stock: faker.number.int({ min: 0, max: 37 }),
            categories: {
              connect: {
                name: currentCategory,
              },
            },
            vendor: {
              connect: {
                id: user.vendor?.id,
              },
            },
            images: {
              createMany: {
                data: currentFakeProduct.images.map((image) => ({
                  url: image,
                })),
              },
            },
          },
        });
        const reviewsToFlush = [];
        for (let j = 0; j < faker.number.int({ max: Math.min(i, 6) }); j++) {
          const randomUser =
            allUsers[faker.number.int({ max: allUsers.length - 1 })];
          console.log(
            "assssss",
            randomUser.firstName,
            "index is: ",
            i,
            `the random is ${faker.number.int({ max: Math.min(i, 6) })}`,
          );
          reviewsToFlush.push(
            prisma.review.create({
              data: {
                rating: faker.number.int({ min: 1, max: 5 }),
                title: faker.word.words({ count: { min: 1, max: 6 } }),
                body: faker.lorem.lines({ min: 1, max: 7 }),
                createdAt: faker.date.between({
                  from: createdAtTime,
                  to: new Date(),
                }),
                upvoteCount: faker.number.int({ min: 0, max: 126 }),
                reviewedBy: {
                  connect: {
                    id: randomUser.id,
                  },
                },
                reviewed: {
                  connect: { id: product.id },
                },
              },
            }),
          );
        }
        await prisma.$transaction(reviewsToFlush);
      }
  }
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
