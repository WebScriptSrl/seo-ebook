import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";

const handler = async (req: NextRequest): Promise<NextResponse> => {
  switch (req.method) {
    case "POST": {
      const { email } = await req.json();

      if (!email) {
        return NextResponse.json({ message: "Email is required", status: 400 });
      }

      try {
        const existingSubscription =
          await prisma.newsletterSubscription.findUnique({
            where: { email },
            select: {
              subscribed: true,
              validationToken: true,
              validationTokenExpires: true,
            },
          });

        const validationToken = jwt.sign({ email }, env.JWT_SECRET, {
          expiresIn: "7d",
        });

        if (
          existingSubscription &&
          existingSubscription.subscribed === "PENDING"
        ) {
          const { validationToken, validationTokenExpires } =
            existingSubscription;
          const tokenValid = validationTokenExpires
            ? new Date(validationTokenExpires) > new Date(Date.now())
            : false;

          if (!tokenValid) {
            const updateSubscription =
              await prisma.newsletterSubscription.update({
                where: { email },
                data: {
                  validationToken,
                  validationTokenExpires: new Date(
                    Date.now() + 1000 * 60 * 60 * 24 * 7,
                  ),
                },
              });

            if (updateSubscription) {
              return NextResponse.json({
                status: 401,
                message: "A new email will be sent for confimation!",
                data: {
                  validationToken,
                  subscribed: updateSubscription.subscribed,
                },
              });
            }

            throw new Error("Internal server error");
          } else {
            return NextResponse.json({
              status: 401,
              message: "Your subscription is pending confirmation!",
              data: { validationToken },
            });
          }
        }

        if (
          existingSubscription &&
          existingSubscription.subscribed === "CONFIRMED"
        ) {
          return NextResponse.json({
            message: "Email already subscribed",
            status: 400,
          });
        }

        const createSubscription = await prisma.newsletterSubscription.upsert({
          where: { email },
          create: {
            email,
            subscribed: "PENDING",
            validationToken,
            validationTokenExpires: new Date(
              Date.now() + 1000 * 60 * 60 * 24 * 7,
            ),
          },
          update: {
            subscribed: "PENDING",
            unsubscribed: false,
            validationToken,
            validationTokenExpires: new Date(
              Date.now() + 1000 * 60 * 60 * 24 * 7,
            ),
            updatedAt: new Date(),
          },
        });

        if (!createSubscription) {
          throw new Error("Internal server error");
        }

        return NextResponse.json({
          status: 201,
          message: `A confirmation email will be sent at: ${email}`,
          data: { validationToken },
        });
      } catch (error) {
        console.error(error);
        return NextResponse.json({
          status: 500,
          message: "Internal server error",
          error,
        });
      }
    }

    case "GET": {
      try {
        const subscriptions = await prisma.newsletterSubscription.findMany();
        return NextResponse.json({
          status: 200,
          subscriptions,
        });
      } catch (error) {
        return NextResponse.json({
          message: "Internal server error",
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

export { handler as GET, handler as POST };
