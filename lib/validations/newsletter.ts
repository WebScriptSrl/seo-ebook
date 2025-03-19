import { NewsletterState } from "@prisma/client";
import * as z from "zod";

export const newsletterSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email.",
  }),
  state: z.nativeEnum(NewsletterState).optional(),
});

export const newsletterStateSchema = z.object({
  state: z.nativeEnum(NewsletterState),
});

export const newsletterDataSchema = z.object({
  userId: z.string().optional(),
  subscribed: z.nativeEnum(NewsletterState),
  email: z.string().email({
    message: "Enter a valid email.",
  }),
  renewed: z.boolean(),
  unsubscribeToken: z.string().nullable(),
  validationToken: z.string().nullable(),
  unsubscribedTokenExpires: z.date().nullable(),
  validationTokenExpires: z.date().nullable(),
  renewedAt: z.date().nullable(),
  createdAt: z.date(),
  expiresDate: z.date(),
  updatedAt: z.date(),
});
