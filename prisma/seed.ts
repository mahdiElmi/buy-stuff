// import { prisma } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";

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
  // const deleteVotes = prisma.vote.deleteMany();
  // const deleteReviews = prisma.review.deleteMany();
  // const deleteImages = prisma.image.deleteMany();
  // const deleteProducts = prisma.product.deleteMany();
  // const deleteCategories = prisma.category.deleteMany();
  // const deleteVendors = prisma.vendor.deleteMany();
  // const deleteUsers = prisma.user.deleteMany();
  // const deleteSessions = prisma.session.deleteMany();
  // const deleteAccounts = prisma.account.deleteMany();
  // await prisma.$transaction([
  //   deleteVotes,
  //   deleteReviews,
  //   deleteImages,
  //   deleteProducts,
  //   deleteVendors,
  //   deleteUsers,
  //   deleteSessions,
  //   deleteAccounts,
  //   deleteCategories,
  // ]);

  const fetchResponse = await fetch("https://api.escuelajs.co/api/v1/products");
  const fakeProducts: fakeStoreProduct[] = await fetchResponse.json();

  // fetch and dedupe categories
  // const fetchCategoryResponse = await fetch(
  //   "https://api.escuelajs.co/api/v1/products",
  // );
  // const fakeCategories: { id: number; image: string; name: string }[] =
  const categoryNames = fakeProducts.map((fakeProduct) => {
    if (fakeProduct.category.name === "change title") return "furniture";
    return fakeProduct.category.name;
  });
  const uniqueCategories = Array.from(new Set(categoryNames));

  console.log(uniqueCategories);

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
  const products = await prisma.product.findMany({});
  const averageRatingsToUpdate = [];
  let i = 1;
  for (let product of products) {
    const reviewAggregation = await prisma.review.aggregate({
      _avg: { rating: true },
      where: { productId: product.id },
    });
    console.log({ i, name: product.name, reviewAggregation });
    i++;
    // averageRatingsToUpdate.push(
    //   prisma.product.update({
    //     where: { id: product.id },
    //     data: { averageRating: reviewAggregation._avg.rating ?? undefined },
    //   }),
    // );
    await prisma.product.update({
      where: { id: product.id },
      data: { averageRating: reviewAggregation._avg.rating ?? undefined },
    });
  }
  // await prisma.$transaction(averageRatingsToUpdate);
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
