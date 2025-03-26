"use server";

import { IProduct } from "@/components/pricing/product-manager";

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

const getGroupedPaginatedProducts = async ({
  page,
  limit,
  type,
}: {
  page: number;
  limit: number;
  type: string;
}): Promise<IProduct[] | null> => {
  const pageNumber = page - 1; // 0-indexed
  try {
    if (type === "direct") {
      const products = await prisma.product.findMany({
        take: limit,
        skip: pageNumber * limit,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          stripePriceId: {
            not: null,
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          name: true,
          description: true,
          key: true,
          price: true,
          discount: true,
          tax: true,
          shipping: true,
          currency: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          stripePriceId: true,
          stripeProductId: true,
          stripeCouponId: true,
          stripePromoCode: true,
          stripePromoCodeExpires: true,
          _count: {
            select: {
              reviews: true,
              orders: true,
            },
          },
        },
      });

      if (!products) {
        return null;
      }

      return products;
    }

    if (type === "amazon") {
      const products = await prisma.product.findMany({
        take: limit,
        skip: pageNumber * limit,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          stripePriceId: {
            equals: null,
          },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          name: true,
          description: true,
          key: true,
          price: true,
          discount: true,
          tax: true,
          shipping: true,
          currency: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          stripePriceId: true,
          stripeProductId: true,
          stripeCouponId: true,
          stripePromoCode: true,
          stripePromoCodeExpires: true,
          _count: {
            select: {
              reviews: true,
              orders: true,
            },
          },
        },
      });

      if (!products) {
        return null;
      }

      return products;
    }

    const products = await prisma.product.findMany({
      take: limit,
      skip: pageNumber * limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        name: true,
        description: true,
        key: true,
        price: true,
        discount: true,
        tax: true,
        shipping: true,
        currency: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        stripePriceId: true,
        stripeProductId: true,
        stripeCouponId: true,
        stripePromoCode: true,
        stripePromoCodeExpires: true,
        _count: {
          select: {
            reviews: true,
            orders: true,
          },
        },
      },
    });

    if (!products) {
      return null;
    }

    return products;
  } catch (error) {
    throw new Error(error);
  }
};

export { getProductByName, countProducts, getGroupedPaginatedProducts };
