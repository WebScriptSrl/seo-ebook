import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    NEXTAUTH_URL: z.string().url().optional(),
    AUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GITHUB_OAUTH_TOKEN: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    AUTH_RESEND_KEY: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
    STRIPE_API_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    NEXT_PUBLIC_GTM_ID: z.string().optional(),
    JWT_SECRET: z.string().min(5),
    RESEND_WEBHOOK_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_LOCAL_SEO_EBOOK_PRICE_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_LOCAL_SEO_EPUB_PRICE_ID: z.string().min(1),
    NEXT_PUBLIC_STRIPE_LOCAL_SEO_PRINT_READY_PRICE_ID: z.string().min(1),
    NEXT_PUBLIC_GTM_ID: z.string().optional(),
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_OAUTH_TOKEN: process.env.GITHUB_OAUTH_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_RESEND_KEY: process.env.AUTH_RESEND_KEY,
    RESEND_WEBHOOK_SECRET: process.env.RESEND_WEBHOOK_SECRET,
    EMAIL_FROM: process.env.EMAIL_FROM,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    JWT_SECRET: process.env.JWT_SECRET,

    // Stripe
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PROMO_CODE: process.env.NEXT_PUBLIC_STRIPE_PROMO_CODE,

    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID:
      process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    NEXT_PUBLIC_STRIPE_LOCAL_SEO_EBOOK_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_LOCAL_SEO_EBOOK_PRICE_ID,
    NEXT_PUBLIC_STRIPE_LOCAL_SEO_EPUB_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_LOCAL_SEO_EPUB_PRICE_ID,
    NEXT_PUBLIC_STRIPE_LOCAL_SEO_PRINT_READY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_LOCAL_SEO_PRINT_READY_PRICE_ID,

    // AWS
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    NEXT_PUBLIC_LOCAL_SEO_EBOOK_BASE_KEY:
      process.env.NEXT_PUBLIC_LOCAL_SEO_EBOOK_BASE_KEY,
    NEXT_PUBLIC_LOCAL_SEO_EPUB_KEY: process.env.NEXT_PUBLIC_LOCAL_SEO_EPUB_KEY,
    NEXT_PUBLIC_LOCAL_SEO_PDF_KEY: process.env.NEXT_PUBLIC_LOCAL_SEO_PDF_KEY,
    NEXT_PUBLIC_LOCAL_SEO_PRINT_READY_KEY:
      process.env.NEXT_PUBLIC_LOCAL_SEO_PRINT_READY_KEY,
  },
});
