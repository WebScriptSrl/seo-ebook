"use server";

import { prisma } from "./db";

const getProductByName = async (name: string) => {
  return await prisma.product.findFirst({
    where: {
      name,
    },
    select: {
      id: true,
    },
  });
};

const countProducts = async () => {
  try {
    return await prisma.product.count();
  } catch (error) {
    return null;
  }
};

export { getProductByName, countProducts };
