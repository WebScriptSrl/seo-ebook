import { prisma } from "@/lib/db";

export const getPaginatedsubscribers = async (page: number, limit: number) => {
  const pageNumber = page - 1; // 0-indexed
  try {
    const subscribers = await prisma.newsletterSubscription.findMany({
      take: limit,
      skip: pageNumber * limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        renewed: true,
        renewedAt: true,
        confirmedAt: true,
        subscribed: true,
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
      const renewed = subscriber.renewed;
      const renewedAt = subscriber.renewedAt;
      const confirmedAt = subscriber.confirmedAt;
      const subscribed = subscriber.subscribed;
      const unsubscribed = subscriber.unsubscribed;
      const unsubscribedAt = subscriber.unsubscribedAt;

      return {
        id,
        email,
        date,
        renewed,
        renewedAt,
        confirmedAt,
        subscribed,
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
