import type { PrismaClient } from "@prisma/client";

const seedAdmin = async (prisma: PrismaClient) => {
  const start = Date.now();
  const adminEmail = process.env.ADMIN_EMAIL;
  console.log("Seeding admin...");
  if (!adminEmail) {
    console.error("ADMIN_EMAIL not set in .env");
    return;
  }
  await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
    create: {
      email: adminEmail,
      role: "ADMIN",
    },
    update: {
      role: "ADMIN",
    },
  });
  console.log(`Admin seeded in ${Date.now() - start}ms`);
};

export default seedAdmin;
