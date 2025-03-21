"use server";

import { UserProductOrder } from "types";
import { amazonProductData, directProductData } from "@/config/products";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function getUserProductOrders(
  userId: string,
): Promise<UserProductOrder | undefined> {
  try {
    if (!userId) throw new Error("Missing parameters");

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        stripeProductId: true,
        stripeCustomerId: true,
        stripePriceId: true,
        orders: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            product: {
              select: {
                name: true,
                image: true,
                description: true,
              },
            },
            customer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user made a purchase
    const isPaid = user.stripePriceId && user.orders.length > 0 ? true : false;

    // Find the pricing data corresponding to the user's orders
    const userPreviousOrder = directProductData.find(
      (order) => order.stripeId === user.stripePriceId,
    );

    const previousOrder =
      isPaid && userPreviousOrder ? userPreviousOrder : null;

    const orderType = userPreviousOrder ? "download" : "amazon";

    let orderDate = Date.now();
    if (isPaid && user.stripeProductId) {
      const stripeProduct = await stripe.products.retrieve(
        user.stripeProductId,
      );
      orderDate = stripeProduct.created;
    }

    if (!previousOrder) {
      return;
    }

    return {
      ...previousOrder,
      ...user,
      stripeCustomerId: user.stripeCustomerId,
      stripePriceId: user.stripePriceId,
      id: user.orders.length > 0 ? user.orders[0].id : "",
      createdAt: orderDate,
      updatedAt: orderDate,
      type: orderType,
      isPaid,
    };
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function getConfirmedOrders(sessionId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        sessionId,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export async function getOrdersByEmail(email: string) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        email,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!orders) {
      throw new Error("Orders not found");
    }

    return orders;
  } catch (error) {
    // console.error(error);
    return null;
  }
}

export const getGroupedPaidOrders = async () => {
  try {
    const groupOrders = await prisma.order.groupBy({
      by: ["createdAt"],
      _sum: {
        total: true,
      },
      _count: {
        status: true,
      },
    });

    if (!groupOrders) {
      throw new Error("Orders not found");
    }

    const thisMonth = new Date().getMonth();
    const lastMonth = new Date().getMonth() - 1;

    const orders = groupOrders.filter(
      (order) => new Date(order.createdAt).getMonth() === thisMonth,
    );

    const lastOrders = groupOrders.filter(
      (order) => new Date(order.createdAt).getMonth() === lastMonth,
    );

    const num = orders.reduce((acc, order) => acc + order._count.status!, 0);
    const lastNum = lastOrders.reduce(
      (acc, order) => acc + order._count.status!,
      0,
    );

    const difference = num - lastNum;

    const percentage =
      Math.round(((num - lastNum) / lastNum) * 100) > 100
        ? 100
        : Math.round(((num - lastNum) / lastNum) * 100);

    const total = orders.reduce((acc, order) => acc + order._sum.total!, 0);
    const lastTotal = lastOrders.reduce(
      (acc, order) => acc + order._sum.total!,
      0,
    );

    const amountPercentage =
      Math.round(((total - lastTotal) / lastTotal) * 100) > 100
        ? 100
        : Math.round(((total - lastTotal) / lastTotal) * 100);

    const allTime = groupOrders.reduce(
      (acc, order) => acc + order._count.status!,
      0,
    );
    const allTimeTotal = groupOrders.reduce(
      (acc, order) => acc + order._sum.total!,
      0,
    );
    const allTimeDifference = num - allTime;
    const allTimePercentage =
      Math.round(((num - allTime) / allTime) * 100) > 100
        ? 100
        : Math.round(((num - allTime) / allTime) * 100);

    return {
      totalOrders: num,
      totalAmount: total,
      difference,
      percentage,
      total,
      amountPercentage,
      allTime,
      allTimeTotal,
      allTimeDifference,
      allTimePercentage,
    };
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const getPaginatedTransactions = async (page: number, limit: number) => {
  try {
    const orders = await prisma.order.findMany({
      take: limit,
      skip: page * limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        productName: true,
        status: true,
        createdAt: true,
        total: true,
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!orders) {
      throw new Error("Orders not found");
    }

    const handleOrders = orders.map((order) => {
      const id = order.id;
      const product = order.productName;
      const customer = order.customer?.name;
      const email = order.customer?.email;
      const status = order.status;
      const date = order.createdAt;
      const amount = order.total;
      return {
        id,
        product,
        customer,
        email,
        status,
        date,
        amount,
      };
    });

    return handleOrders;
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const getPaginatedOrders = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const pageNumber = page - 1; // 0-indexed
  try {
    const orders = await prisma.order.findMany({
      take: limit,
      skip: pageNumber * limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        productName: true,
        status: true,
        createdAt: true,
        total: true,
        discount: true,
        discountCode: true,
        currency: true,
        hostedInvoiceUrl: true,
        invoicePdf: true,
        paymentMethodType: true,
        customer: {
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
            userId: true,
          },
        },
        downloads: {
          select: {
            id: true,
            activated: true,
            used: true,
            expires: true,
            downloadCount: true,
          },
        },
      },
    });

    if (!orders) {
      throw new Error("Orders not found");
    }

    return orders;
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const countOrders = async () => {
  try {
    const count = await prisma.order.count();

    return count;
  } catch (error) {
    // console.error(error);
    return null;
  }
};

export const getSellSession = async () => {
  try {
    const session = await prisma.sellSession.findFirst();

    if (!session) {
      const defaultSession = await prisma.sellSession.create({
        data: {
          name: "Sales",
          sellStop: false,
          showBanner: false,
          bannerTitle: "",
          description: "",
        },
      });

      return defaultSession;
    }

    return session;
  } catch (error) {
    // console.error(error);
    return null;
  }
};
