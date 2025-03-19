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

  const { reviewsIds } = (await req.json()) as { reviewsIds: string[] };

  try {
    const { count } = await prisma.review.deleteMany({
      where: {
        id: {
          in: reviewsIds,
        },
      },
    });

    if (count !== reviewsIds.length) {
      return new Response("Invalid reviews", { status: 400 });
    }

    return new Response("Reviews deleted successfully!", { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
});
