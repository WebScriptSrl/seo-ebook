import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";

const handler = async (req: NextRequest): Promise<NextResponse> => {
  const cookieStore = await cookies();

  switch (req.method) {
    case "POST": {
      const { token } = await req.json();

      if (!token) {
        return NextResponse.json({
          message: "Validation token is missing",
          status: 400,
        });
      }

      try {
        const subscriptionReq = await prisma.newsletterSubscription.findUnique({
          where: { validationToken: token },
          select: { id: true, email: true, validationTokenExpires: true },
        });

        if (subscriptionReq) {
          // CONSIDER adding a check IF WE HAVE A USER WITH THE SAME EMAIL and Update DATA !!!
          const { email, id, validationTokenExpires } = subscriptionReq;
          const tokenValid = validationTokenExpires
            ? new Date(validationTokenExpires) > new Date(Date.now())
            : false;

          if (!tokenValid) {
            return NextResponse.json({
              message: "Validation token is expired",
              status: 400,
            });
          }

          const createSubscription = await prisma.newsletterSubscription.update(
            {
              where: { id },
              data: {
                subscribed: "CONFIRMED",
                confirmedAt: new Date(),
              },
            },
          );

          const user = await prisma.user.findUnique({
            where: { email: email },
            select: { id: true },
          });

          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { emailVerified: new Date() },
            });
          }

          const consentCookie = req.headers.get("getSetCookie");
          const subscriptionCookie = req.headers.get("append");

          const consent = consentCookie
            ? cookieStore.get(consentCookie)
            : undefined;

          if (consent && subscriptionCookie) {
            const { categories, expiresDate } = JSON.parse(consent.value);
            if (
              categories.includes("functional") &&
              new Date(expiresDate) > new Date(Date.now())
            ) {
              cookieStore.set(
                subscriptionCookie,
                JSON.stringify({
                  subscribed: true,
                  id: createSubscription.id,
                  date: new Date(createSubscription.createdAt),
                  expiresDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                }),
                {
                  path: "/",
                  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "lax",
                },
              );
            }
          }

          const token = jwt.sign({ id }, env.JWT_SECRET);

          await prisma.newsletterSubscription.update({
            where: { id },
            data: {
              validationToken: null,
              validationTokenExpires: null,
              unsubscribeToken: token,
              unsubscribeTokenExpires: new Date(
                Date.now() + 1000 * 60 * 60 * 24 * 365 * 10,
              ),
              updatedAt: new Date(),
            },
          });

          return NextResponse.json({
            status: 201,
            message: `Subscribed to newsletter with email: ${email}`,
            data: { id },
          });
        } else {
          return NextResponse.json({
            message: "Invalid validation token",
            status: 400,
          });
        }
      } catch (error) {
        return NextResponse.json({
          message: "Internal server error",
          error,
          status: 500,
        });
      }
    }

    case "GET": {
      const id = req.headers.get("id");

      if (!id) {
        return NextResponse.json({ message: "ID is missing" }, { status: 400 });
      }
      try {
        const subscription = await prisma.newsletterSubscription.findUnique({
          where: { id },
          select: { subscribed: true, unsubscribeToken: true, email: true },
        });

        if (!subscription) {
          return NextResponse.json({
            message: "Subscription not found",
            status: 404,
          });
        }

        return NextResponse.json({ subscription, status: 200 });
      } catch (error) {
        return NextResponse.json({
          message: error.message,
          status: error.status,
        });
      }
    }

    default: {
      return NextResponse.json({ message: "Method not allowed", status: 405 });
    }
  }
};

export { handler as GET, handler as POST };
