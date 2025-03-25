import { prisma } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        name: true,
        emailVerified: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};

export const getPaginatedUsers = async (page: number, limit: number) => {
  try {
    const users = await prisma.user.findMany({
      take: limit,
      skip: page * limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            reviews: true,
            orders: true,
            emails: true,
            sessions: true,
            downloads: true,
          },
        },
      },
    });

    if (!users) {
      return null;
    }

    const handleUsers = users.map((user) => {
      const id = user.id;
      const name = user.name;
      const email = user.email;
      const emailVerified = user.emailVerified;
      const role = user.role;
      const date = user.createdAt;
      const reviews = user._count.reviews;
      const orders = user._count.orders;

      return {
        id,
        name,
        email,
        emailVerified,
        role,
        date,
        reviews,
        orders,
      };
    });

    return handleUsers;
  } catch {
    return null;
  }
};
