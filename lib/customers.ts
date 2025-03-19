"use server";

import { prisma } from "./db";

const getCustomerById = async (customerId: string) =>
  await prisma.customer.findFirst({
    where: {
      email: customerId,
    },
    select: {
      name: true,
      email: true,
      phone: true,
      addressOne: true,
      addressTwo: true,
      city: true,
      state: true,
      zip: true,
      country: true,
    },
  });

export { getCustomerById };
