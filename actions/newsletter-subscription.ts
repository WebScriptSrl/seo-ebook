"use server";

import { auth } from "@/auth";
import { Email, NewsletterState } from "@prisma/client";

import { prisma } from "@/lib/db";

export type NewsletterSubscriptionData = {
  subscribed: NewsletterState;
  email: string;
  emails?: {
    id: string;
    sentAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  unsubscribed: boolean;
  renewed: boolean;
  unsubscribeToken?: string | null;
  validationToken?: string | null;
  unsubscribedTokenExpires?: Date;
  validationTokenExpires?: Date;
  renewedAt: Date | null;
  createdAt: Date;
  expiresDate: Date;
  updatedAt: Date;
  confirmationSentAt?: Date;
  confirmedAt?: Date;
};

export async function getSubscription(
  email: string,
  type: "user" | "non-user",
) {
  switch (type) {
    case "user": {
      try {
        const session = await auth();

        if (!session?.user) {
          return {
            status: 401,
            message: "Unauthorized",
          };
        }

        const subscription = await prisma.newsletterSubscription.findUnique({
          where: {
            email,
          },
          select: {
            subscribed: true,
            renewed: true,
            renewedAt: true,
            createdAt: true,
            validationToken: true,
            unsubscribeToken: true,
            confirmedAt: true,
            updatedAt: true,
            unsubscribed: true,
            userId: true,
            emails: {
              where: {
                type: "confirm-subscription",
                emails: {
                  has: email,
                },
              },
              select: {
                id: true,
                sentAt: true,
                openedAt: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        });

        if (!subscription) {
          return {
            status: 404,
            message: "Subscription not found",
          };
        }

        const subscriptionData: NewsletterSubscriptionData = {
          subscribed: subscription?.subscribed,
          renewed: subscription?.renewed,
          renewedAt: subscription.renewedAt,
          unsubscribed: subscription.unsubscribed,
          createdAt: subscription?.createdAt,
          expiresDate: new Date(
            subscription?.createdAt.getTime() + 1000 * 60 * 60 * 24 * 365,
          ),
          validationToken: subscription.validationToken,
          unsubscribeToken: subscription.unsubscribeToken,

          confirmedAt: subscription?.confirmedAt
            ? new Date(subscription.confirmedAt)
            : undefined,
          email: email,
          emails: subscription.emails,
          updatedAt: subscription?.updatedAt,
        };

        return {
          status: 200,
          data: subscriptionData,
        };
      } catch (error) {
        return {
          status: 500,
          message: "Internal server error",
        };
      }
    }

    case "non-user": {
      try {
        const subscription = await prisma.newsletterSubscription.findUnique({
          where: {
            email,
          },
          select: {
            subscribed: true,
            renewed: true,
            renewedAt: true,
            createdAt: true,
            validationToken: true,
            unsubscribeToken: true,
            confirmedAt: true,
            updatedAt: true,
            unsubscribed: true,
            userId: true,
            emails: {
              where: {
                type: "confirm-subscription",
                emails: {
                  has: email,
                },
              },
              select: {
                id: true,
                sentAt: true,
                openedAt: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        });

        if (!subscription) {
          return {
            status: 404,
            message: "Subscription not found",
          };
        }

        const subscriptionData: NewsletterSubscriptionData = {
          subscribed: subscription?.subscribed,
          renewed: subscription?.renewed,
          renewedAt: subscription.renewedAt,
          unsubscribed: subscription.unsubscribed,
          createdAt: subscription?.createdAt,
          expiresDate: new Date(
            subscription?.createdAt.getTime() + 1000 * 60 * 60 * 24 * 365,
          ),
          validationToken: subscription.validationToken,
          unsubscribeToken: subscription.unsubscribeToken,

          confirmedAt: subscription?.confirmedAt
            ? new Date(subscription.confirmedAt)
            : undefined,
          email: email,
          emails: subscription.emails,
          updatedAt: subscription?.updatedAt,
        };

        return {
          status: 200,
          data: subscriptionData,
        };
      } catch (error) {
        return {
          status: 500,
          message: "Internal server error",
        };
      }
    }
  }
}
