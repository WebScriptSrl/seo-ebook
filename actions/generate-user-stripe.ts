"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Stripe from "stripe";

import { directProductData } from "@/config/products";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";

export type ResponseAction = {
  status: "success" | "error";
  stripeUrl?: string;
};

// const userBillingUrl = absoluteUrl("/dashboard/billing")
const billingUrl = absoluteUrl("/pricing");
const successUrl = absoluteUrl("/order-success");

export async function generateUserStripe(
  mode: Stripe.Checkout.SessionCreateParams.Mode,
  priceId: string,
): Promise<ResponseAction> {
  let redirectUrl: string = "";
  const session = await auth();

  try {
    switch (mode) {
      case "payment":
        const product = await prisma.product.findFirst({
          where: {
            stripePriceId: priceId,
          },
          select: {
            title: true,
            description: true,
            key: true,
            price: true,
            stripePromoCode: true,
          },
        });

        if (!product) {
          throw new Error("Product not found");
        }

        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: billingUrl,
          mode: mode,
          customer_email: session?.user?.email ? session.user.email : undefined,
          invoice_creation: {
            enabled: true,
            invoice_data: {
              footer: `Thank you for your purchase! Enjoy your reading, and happy learning!
              The invoice is valid without signature, according to the law on electronic documents and electronic signatures.
              `,
            },
          },
          billing_address_collection: "required",
          line_items: [
            {
              price_data: {
                currency: "USD",
                product_data: {
                  name: product.title,
                  description: product.description,
                },
                unit_amount: product.price * 100,
              },
              quantity: 1,
            },
          ],
          discounts: [
            {
              promotion_code: product.stripePromoCode
                ? product.stripePromoCode
                : "",
            },
          ],
          metadata: {
            priceId: priceId,
            userId: session?.user?.id ? session.user.id : "",
            product: product.title,
            key: product.key,
            quantity: 1,
          },
        });
        redirectUrl = stripeSession.url as string;
        break;

      case "subscription":
        const user = session?.user;
        if (!user || !user.email || !user.id) {
          throw new Error("User not found");
        }
        const subscriptionPlan = await getUserSubscriptionPlan(user.id);

        if (subscriptionPlan.isPaid && subscriptionPlan.stripeCustomerId) {
          // User on Paid Plan - Create a portal session to manage subscription.
          const stripeSession = await stripe.billingPortal.sessions.create({
            customer: subscriptionPlan.stripeCustomerId,
            return_url: billingUrl,
          });

          redirectUrl = stripeSession.url as string;
        } else {
          // User on Free Plan - Create a checkout session to upgrade.
          const stripeSession = await stripe.checkout.sessions.create({
            success_url: billingUrl,
            cancel_url: billingUrl,
            mode: mode,
            billing_address_collection: "auto",
            customer_email: user.email,
            line_items: [
              {
                price: priceId,
                quantity: 1,
              },
            ],
            metadata: {
              userId: user.id,
            },
          });

          redirectUrl = stripeSession.url as string;
        }
        break;

      default:
        throw new Error(`Invalid mode: ${mode}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate user stripe session");
  }

  // no revalidatePath because redirect
  redirect(redirectUrl);
}
