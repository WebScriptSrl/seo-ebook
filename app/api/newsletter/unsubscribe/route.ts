import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

const handler = async (req: NextRequest): Promise<NextResponse> => {
  const cookieStore = await cookies();

  switch (req.method) {
    case "POST": {
      const { token } = await req.json();

      if (!token) {
        return NextResponse.json({
          message: "Unsubscribe token is missing",
          status: 400,
        });
      }

      try {
        const unsubscribeReq = await prisma.newsletterSubscription.update({
          where: { unsubscribeToken: token },
          data: {
            unsubscribed: true,
            unsubscribedAt: new Date(),
            unsubscribeToken: null,
            subscribed: "UNSUBSCRIBED",
          },
        });

        if (!unsubscribeReq) {
          return NextResponse.json({
            message: "Invalid unsubscribe token",
            status: 400,
          });
        }

        const subscriptionCookie = req.headers.get("getSetCookie");

        if (subscriptionCookie) {
          cookieStore.delete(subscriptionCookie);
        }

        return NextResponse.json({
          status: 201,
          message: `Unsubscribed successfully!`,
          data: { unsubscribeReq },
        });
      } catch (error) {
        return NextResponse.json({
          message: error.message || "An error occurred while unsubscribing",
          error,
          status: 500,
        });
      }
    }

    default: {
      return NextResponse.json({ message: "Method not allowed", status: 405 });
    }
  }
};

export { handler as POST };
