"use server";

import { revalidatePath } from "next/cache";
import NewsletterSubscriptionEmail from "@/emails/subscription-email";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";

import { prisma } from "../db";
import { resend } from "../resend";

const sendSubscriptionEmail = async ({
  path,
  to,
  mailType,
  validationToken,
  firstName,
  unsubscribeToken,
}: {
  path: string;
  to: string;
  mailType: "confirm" | "welcome";
  validationToken?: string;
  firstName?: string;
  unsubscribeToken?: string;
}) => {
  switch (mailType) {
    case "confirm": {
      const actionUrl = `${process.env.NEXT_PUBLIC_APP_URL}/confirm-newsletter-subscription?vTok=${validationToken}`;
      try {
        const { data, error } = await resend.emails.send({
          from: process.env.EMAIL_FROM as string,
          to:
            process.env.NODE_ENV === "development"
              ? "delivered@resend.dev"
              : to,
          subject: "SEO.eBook newsletter subscription confirmation",
          react: NewsletterSubscriptionEmail({
            actionUrl: actionUrl,
            siteName: siteConfig.name,
            firstName: firstName ? firstName : "future SEO master",
            mailType: mailType,
            baseUrl: env.NEXT_PUBLIC_APP_URL,
          }),
          headers: {
            "X-Entity-Ref-ID": new Date().getTime() + "",
          },
        });

        if (error || !data) {
          throw new Error(error?.message);
        }

        await prisma.newsletterSubscription.update({
          where: {
            validationToken,
          },
          data: {
            emails: {
              upsert: {
                where: {
                  emailId: data.id,
                },
                create: {
                  emailId: data.id,
                  type: "confirm-subscription",
                  subject: "Confirm your subscription to SEO.eBook",
                  emails: [to],
                  sentAt: new Date(),
                },
                update: {
                  type: "confirm-subscription",
                  subject: "Confirm your subscription to SEO.eBook",
                  emails: [to],
                  sentAt: new Date(),
                },
              },
            },
          },
        });

        revalidatePath(path);
        return data;
      } catch (error) {
        throw new Error("Failed to send email");
      }
    }

    case "welcome": {
      const actionUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe-newsletter?token=${unsubscribeToken}`;
      try {
        const { data, error } = await resend.emails.send({
          from: process.env.EMAIL_FROM as string,
          to:
            process.env.NODE_ENV === "development"
              ? "delivered@resend.dev"
              : to,
          subject: "Welcome to SEO.eBook newsletter",
          react: NewsletterSubscriptionEmail({
            actionUrl: actionUrl,
            siteName: siteConfig.name,
            firstName: firstName ? firstName : "future SEO master",
            mailType: mailType,
            baseUrl: env.NEXT_PUBLIC_APP_URL,
          }),
          headers: {
            "X-Entity-Ref-ID": new Date().getTime() + "",
          },
        });

        if (error || !data) {
          throw new Error(error?.message);
        }

        await prisma.newsletterSubscription.update({
          where: {
            unsubscribeToken,
          },
          data: {
            emails: {
              upsert: {
                where: {
                  emailId: data.id,
                },
                create: {
                  emailId: data.id,
                  type: "welcome-subscription",
                  subject: "Welcome to SEO.eBook newsletter",
                  emails: [to],
                  sentAt: new Date(),
                },
                update: {
                  type: "welcome-subscription",
                  subject: "Welcome to SEO.eBook newsletter",
                  emails: [to],
                  sentAt: new Date(),
                },
              },
            },
          },
        });

        revalidatePath(path);
        return data;
      } catch (error) {
        throw new Error("Failed to send email");
      }
    }

    default:
      throw new Error("Invalid mail type");
  }
};

export default sendSubscriptionEmail;
