import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";

const useLocal = process.env.USE_LOCAL_DATA === "true"; // set this in .env.local

async function main() {
  // Load products from local JSON
  let products: any[];
  if (useLocal) {
    console.log("Loading products from local products.json...");
    const filePath = path.join(__dirname, "products.json");
    const fileData = fs.readFileSync(filePath, "utf-8");
    products = JSON.parse(fileData).products;
  } else {
    console.log("Fetching products from DummyJSON...");
    const res = await fetch("https://dummyjson.com/products?limit=100");
    const data = await res.json();
    products = data.products;
  }
  // ---- Clear all data in correct order (respecting FK constraints) ----
  console.log("Clearing old data...");
  await prisma.vote.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.shoppingCartItem.deleteMany();
  await prisma.list.deleteMany();
  await prisma.product.deleteMany();
  await prisma.image.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.shippingAddress.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // ---- 1. Categories ----
  const categoryNames = [...new Set(products.map((p: any) => p.category))];
  console.log(`Creating ${categoryNames.length} categories...`);
  const categoryRecords = [];
  for (const name of categoryNames) {
    const cat = await prisma.category.create({
      data: {
        name: name as string,
        description: faker.commerce.productDescription(),
      },
    });
    categoryRecords.push(cat);
  }

  // ---- 2. Users & Vendors & Shipping Addresses ----
  console.log(
    "Creating 20 users (some vendors, all with shipping addresses)...",
  );
  const users = [];
  for (let i = 0; i < 20; i++) {
    // Randomly make every 3rd user a vendor (about 7 vendors)
    const isVendor = i % 3 === 0;
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.username(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        image: faker.image.avatar(),
        emailVerified: faker.datatype.boolean(),
        // Create vendor if flagged
        vendor: isVendor
          ? {
              create: {
                name: faker.company.name(),
                description: faker.company.catchPhrase(),
                imageURL: faker.image.urlLoremFlickr({ category: "business" }),
                bannerImage: faker.image.urlLoremFlickr({ category: "nature" }),
              },
            }
          : undefined,
        // Create 1-3 shipping addresses per user
        shippingAddresses: {
          create: Array.from({
            length: faker.number.int({ min: 1, max: 3 }),
          }).map(() => ({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            country: faker.location.country(),
            state: faker.location.state(),
            city: faker.location.city(),
            address: faker.location.streetAddress(),
            zip: faker.location.zipCode(),
            phoneNumber: faker.phone.number(),
          })),
        },
      },
      include: {
        vendor: true,
        shippingAddresses: true,
      },
    });

    // Set one address as default for the user
    if (user.shippingAddresses.length > 0) {
      const defaultAddr = user.shippingAddresses[0];
      await prisma.user.update({
        where: { id: user.id },
        data: { defaultShippingAddressId: defaultAddr.id },
      });
      // also update the address’s isDefault relation (though not required, good for completeness)
      // Note: In your schema, ShippingAddress.isDefault is a User? relation; we can't set it directly.
      // The defaultShippingAddress relation in User is the main link.
    }

    users.push(user);
  }

  const vendors = users.filter((u) => u.vendor).map((u) => u.vendor!);

  // ---- 3. Products & Images ----
  console.log(`Creating ${products.length} products...`);
  const createdProducts: any[] = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    // Distribute products among vendors in round-robin
    const randomVendor = vendors[i % vendors.length];
    const product = await prisma.product.create({
      data: {
        name: p.title,
        price: p.price,
        discountPercentage: Math.round(p.discountPercentage) || 0,
        description: p.description,
        stock: p.stock,
        averageRating: p.rating,
        categories: { connect: { name: p.category } },
        vendor: { connect: { id: randomVendor.id } },
        images: {
          createMany: {
            data: p.images.map((url: string) => ({ url })),
          },
        },
      },
    });
    createdProducts.push(product);
  }

  // ---- 4. Reviews & Votes ----
  console.log("Adding reviews and votes...");
  for (const product of createdProducts) {
    // Random number of reviews (0-8)
    const reviewCount = faker.number.int({ min: 0, max: 8 });
    for (let r = 0; r < reviewCount; r++) {
      // Pick a random user (not necessarily the vendor)
      const randomUser = faker.helpers.arrayElement(users);
      const review = await prisma.review.create({
        data: {
          title: faker.lorem.sentence(3),
          rating: faker.number.int({ min: 1, max: 5 }),
          body: faker.lorem.paragraph(),
          upvoteCount: 0, // will be calculated later based on votes
          reviewedBy: { connect: { id: randomUser.id } },
          reviewed: { connect: { id: product.id } },
        },
      });

      // Add some votes on this review
      const voteCount = faker.number.int({ min: 0, max: 5 });
      for (let v = 0; v < voteCount; v++) {
        const voter = faker.helpers.arrayElement(
          users.filter((u) => u.id !== randomUser.id), // don't let user vote on own review
        );
        if (!voter) continue;
        // Prevent duplicate votes (unique constraint on userId+reviewId) – use create with try-catch or check
        try {
          await prisma.vote.create({
            data: {
              isVoteUp: faker.datatype.boolean(),
              userId: voter.id,
              reviewId: review.id,
            },
          });
        } catch {
          // duplicate vote, skip
        }
      }
    }

    // Update upvoteCount on the review based on actual votes (optional, but consistent)
    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      include: { Vote: true },
    });
    for (const rev of reviews) {
      const upCount = rev.Vote.filter((v) => v.isVoteUp).length;
      await prisma.review.update({
        where: { id: rev.id },
        data: { upvoteCount: upCount },
      });
    }

    // Update average rating on product
    const avgRating = await prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
    });
    await prisma.product.update({
      where: { id: product.id },
      data: {
        averageRating: avgRating._avg.rating ?? product.averageRating,
      },
    });
  }

  // ---- 5. Shopping Cart Items ----
  console.log("Adding random cart items...");
  for (const user of users) {
    const cartItemsCount = faker.number.int({ min: 0, max: 5 });
    const productsToAdd = faker.helpers.arrayElements(
      createdProducts,
      cartItemsCount,
    );
    for (const product of productsToAdd) {
      // Prevent duplicate cart item (unique on productId+userId)
      try {
        await prisma.shoppingCartItem.create({
          data: {
            quantity: faker.number.int({ min: 1, max: 3 }),
            user: { connect: { id: user.id } },
            product: { connect: { id: product.id } },
          },
        });
      } catch {
        // skip if already exists
      }
    }
  }

  // ---- 6. Lists (Product collections) ----
  console.log("Creating product lists...");
  for (let i = 0; i < 10; i++) {
    const author = faker.helpers.arrayElement(users);
    const listProducts = faker.helpers.arrayElements(
      createdProducts,
      faker.number.int({ min: 1, max: 8 }),
    );
    await prisma.list.create({
      data: {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        author: { connect: { id: author.id } },
        products: { connect: listProducts.map((p) => ({ id: p.id })) },
      },
    });
  }

  // ---- 7. Orders & Order Items ----
  console.log("Creating orders...");
  for (const user of users) {
    // Make 0-3 orders per user
    const orderCount = faker.number.int({ min: 0, max: 3 });
    for (let o = 0; o < orderCount; o++) {
      // Pick a random shipping address belonging to this user (if any)
      const addresses = await prisma.shippingAddress.findMany({
        where: { userId: user.id },
      });
      if (addresses.length === 0) continue;
      const address = faker.helpers.arrayElement(addresses);

      // Select random products and quantities
      const itemsCount = faker.number.int({ min: 1, max: 5 });
      const orderProducts = faker.helpers.arrayElements(
        createdProducts,
        itemsCount,
      );
      let total = 0;
      const orderItemsData = orderProducts.map((prod) => {
        const qty = faker.number.int({ min: 1, max: 3 });
        const itemTotal = prod.price * qty;
        total += itemTotal;
        return {
          productId: prod.id,
          quantity: qty,
        };
      });

      // Determine a random vendor from the products in the order (just for demo)
      const randomOrderProduct = orderProducts[0];
      const vendorId = randomOrderProduct.vendorId;

      // Set a random package state
      const states = [
        "ORDERED",
        "PROCESSING",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "RETURNED",
        "CANCELLED",
        "LOST",
      ];
      const state = faker.helpers.arrayElement(states);

      await prisma.order.create({
        data: {
          buyer: { connect: { id: user.id } },
          shippingAddress: { connect: { id: address.id } },
          total: Math.round(total),
          state: state as any,
          Vendor: vendorId ? { connect: { id: vendorId } } : undefined,
          items: {
            createMany: { data: orderItemsData },
          },
        },
      });
    }
  }

  console.log("✅ Exhaustive seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
