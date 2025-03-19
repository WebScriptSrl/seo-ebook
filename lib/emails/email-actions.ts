"use server";

import { prisma } from "../db";

const getOrderEmails = async (id: string) => {
  const emails = await prisma.email.findMany({
    where: {
      orderId: id,
    },
    select: {
      delivered: true,
      sentAt: true,
      deliveredAt: true,
    },
  });

  return emails;
};

export { getOrderEmails };
