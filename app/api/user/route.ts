import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export const DELETE = auth(async (req) => {
  if (!req.auth) {
    return new Response("Not authenticated", { status: 401 });
  }

  const currentUser = req.auth.user;
  if (!currentUser) {
    return new Response("Invalid user", { status: 401 });
  }

  try {
    if (currentUser.id && currentUser.email) {
      await prisma.deletedUsers.create({
        data: {
          userId: currentUser.id,
          reason: "User requested account deletion",
          email: currentUser.email,
        },
      });

      const newsletterSubscription =
        await prisma.newsletterSubscription.findFirst({
          where: {
            email: currentUser.email,
          },
        });

      if (newsletterSubscription) {
        await prisma.newsletterSubscription.update({
          where: {
            id: newsletterSubscription.id,
          },
          data: {
            subscribed: "UNSUBSCRIBED",
            unsubscribed: true,
            unsubscribedAt: new Date(),
            unsubscribeToken: null,
            unsubscribeTokenExpires: null,
          },
        });
      }
    }

    await prisma.user.delete({
      where: {
        id: currentUser.id,
      },
    });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }

  return new Response("User deleted successfully!", { status: 200 });
});
