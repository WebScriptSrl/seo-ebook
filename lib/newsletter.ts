import { prisma } from "@/lib/db";

export const getPaginatedsubscribers = async (page: number, limit: number) => {
  try {
    const subscribers = await prisma.newsletterSubscription.findMany({
      take: limit,
      skip: page * limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        subscribed: true,
        user: {
          select: {
            name: true,
          },
        },
        unsubscribed: true,
        unsubscribedAt: true,
      },
    });

    if (!subscribers) {
      return null;
    }

    const handleSubscribers = subscribers.map((subscriber) => {
      const id = subscriber.id;
      const email = subscriber.email;
      const date = subscriber.createdAt;
      const subscribed = subscriber.subscribed;
      const userName = subscriber.user?.name
        ? subscriber.user?.name
        : "Not a user";
      const unsubscribed = subscriber.unsubscribed;
      const unsubscribedAt = subscriber.unsubscribedAt;

      return {
        id,
        email,
        date,
        subscribed,
        userName,
        unsubscribed,
        unsubscribedAt,
      };
    });

    return handleSubscribers;
  } catch (error) {
    // console.error(error);
    return null;
  }
};
