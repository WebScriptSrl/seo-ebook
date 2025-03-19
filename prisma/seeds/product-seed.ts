import type { PrismaClient } from "@prisma/client";

import { amazonProductData, directProductData } from "../../config/products";

const seedProducts = async (prisma: PrismaClient) => {
  const start = Date.now();
  console.log("Seeding products...");
  for (const product of directProductData) {
    console.log(`Seeding product: ${product.title}`);
    await prisma.product.upsert({
      where: {
        stripePriceId: product.stripeId,
      },
      create: {
        title: product.title,
        name: product.title.toLowerCase(),
        description: product.description,
        key: product.key,
        price: product.price.full,
        discount: product.price.discount,
        image: product.image,
        stripePriceId: product.stripeId,
        stripePromoCode: product.promoCode,
      },
      update: {
        title: product.title,
        name: product.title.toLowerCase(),
        description: product.description,
        key: product.key,
        price: product.price.full,
        discount: product.price.discount,
        image: product.image,
        stripePromoCode: product.promoCode,
      },
    });
  }

  console.log(`Products seeded in ${Date.now() - start}ms`);
};

const seedAmzProducts = async (prisma: PrismaClient) => {
  const start = Date.now();
  console.log("Seeding Amazon products...");
  for (const product of amazonProductData) {
    if (product.amzUrl) {
      console.log(`Seeding Amazon product: ${product.title}`);
      await prisma.product.upsert({
        where: {
          name: product.title.toLowerCase(),
        },
        create: {
          title: product.title,
          name: product.title.toLowerCase(),
          description: product.description,
          key: product.title.toLowerCase(),
          price: product.price.full,
          discount: product.price.discount,
          image: product.image,
        },
        update: {
          title: product.title,
          name: product.title.toLowerCase(),
          description: product.description,
          key: product.title.toLowerCase(),
          price: product.price.full,
          discount: product.price.discount,
          image: product.image,
        },
      });
    }
  }
};

export { seedProducts, seedAmzProducts };
