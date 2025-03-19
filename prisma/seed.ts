import { PrismaClient } from "@prisma/client";

import seedAdmin from "./seeds/admin-seed";
import { seedAmzProducts, seedProducts } from "./seeds/product-seed";

const prisma = new PrismaClient();

export async function main() {
  await seedProducts(prisma);
  await seedAmzProducts(prisma);
  await seedAdmin(prisma);
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
