import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import Stripe from "stripe";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";
import { getDownloadFileSignedUrl } from "@/lib/s3Utils";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "invoice.payment_succeeded") {
    const session = event.data.object as Stripe.Invoice;

    switch (session.billing_reason) {
      case "manual":
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string,
        );

        try {
          if (paymentIntent.status !== "succeeded") {
            throw new Error("Payment intent not succeeded");
          } else {
            const order = await prisma.order.upsert({
              where: {
                sessionId: session.discount?.checkout_session as string,
              },
              create: {
                sessionId: session.discount?.checkout_session as string,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
                email: session.customer_email,
                total: session.amount_paid,
                currency: session.currency,
                customerId: session.customer as string,
                hostedInvoiceUrl: session.hosted_invoice_url as string,
                invoicePdf: session.invoice_pdf as string,
                receiptUrl: session.hosted_invoice_url as string,
                quantity: 1,
                productPrice: session.lines.data[0].amount,
                paymentMethodType: paymentIntent.payment_method_types[0],
                discount: session.discount?.coupon.amount_off,
                discountCode: session.discount?.coupon.name,
                paymentMethodId: paymentIntent.payment_method as string,
              },

              update: {
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
                email: session.customer_email,
                total: session.amount_paid,
                currency: session.currency,
                customerId: session.customer as string,
                hostedInvoiceUrl: session.hosted_invoice_url as string,
                invoicePdf: session.invoice_pdf as string,
                receiptUrl: session.hosted_invoice_url as string,
                quantity: 1,
                productPrice: session.lines.data[0].amount,
                paymentMethodType: paymentIntent.payment_method_types[0],
                discount: session.discount?.coupon.amount_off,
                discountCode: session.discount?.coupon.name,
                paymentMethodId: paymentIntent.payment_method as string,
              },
            });

            if (!order) {
              throw new Error("Failed to create order");
            }

            revalidatePath(`/order-success`);
          }
        } catch (error) {
          console.error("Invoice payment succeeded error", error);
        }
        break;

      case "subscription_create":
        // If the billing reason is not subscription_create, it means the customer has updated their subscription.
        // If it is subscription_create, we don't need to update the subscription id and it will handle by the checkout.session.completed event.
        if (session.billing_reason != "subscription_create") {
          // Retrieve the subscription details from Stripe.
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
          );

          // Update the price id and set the new period end.
          await prisma.user.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000,
              ),
            },
          });
        }

        break;

      case "subscription_update":
        // Retrieve the subscription details from Stripe.
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );

        // Update the price id and set the new period end.
        await prisma.user.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
          },
        });
        break;
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    switch (session.mode) {
      case "payment":
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string,
        );

        // console.log("Payment intent", paymentIntent);
        const { status } = paymentIntent;

        if (status !== "succeeded") {
          console.error("Payment intent not succeeded", status);
        } else {
          const key = session.metadata?.key;
          const product = session.metadata?.product;
          const userId = session.metadata?.userId;
          const quantity = session.metadata?.quantity;

          if (!key || !product || !quantity) {
            throw new Error("Key, product, or quantity not found");
          }

          const downloadUrl = await getDownloadFileSignedUrl({
            key: key,
            expire: 24, // 24 hours expiry - default is 6 hours.
          });

          if (userId) {
            const userOrder = await prisma.user.upsert({
              where: {
                id: userId,
              },
              create: {
                orders: {
                  connectOrCreate: {
                    where: {
                      sessionId: session.id as string,
                    },
                    create: {
                      sessionId: session.id as string,
                      status: paymentIntent.status,
                      email: session.customer_details?.email,
                      total: session.amount_total as number,
                      currency: session.currency,
                      paymentIntentId: paymentIntent.id,
                      quantity: Number(session.metadata?.quantity),
                      productPrice: session.amount_subtotal as number,
                      paymentMethodType: paymentIntent.payment_method_types[0],
                      paymentMethodId: paymentIntent.payment_method as string,
                      productName: session.metadata?.product as string,
                      downloads: {
                        connectOrCreate: {
                          where: {
                            orderId: session.id as string,
                          },
                          create: {
                            sessionId: session.id as string,
                            key: key as string,
                            expires: new Date(
                              new Date().getTime() + 24 * 60 * 60 * 1000,
                            ),
                            url: downloadUrl,
                            activated: new Date(),
                          },
                        },
                      },
                    },
                  },
                },
              },
              update: {
                orders: {
                  connectOrCreate: {
                    where: {
                      sessionId: session.id as string,
                    },
                    create: {
                      sessionId: session.id as string,
                      status: paymentIntent.status,
                      email: session.customer_details?.email,
                      total: session.amount_total as number,
                      currency: session.currency,
                      paymentIntentId: paymentIntent.id,
                      quantity: Number(session.metadata?.quantity),
                      productPrice: session.amount_subtotal as number,
                      paymentMethodType: paymentIntent.payment_method_types[0],
                      paymentMethodId: paymentIntent.payment_method as string,
                      productName: session.metadata?.product as string,
                      downloads: {
                        connectOrCreate: {
                          where: {
                            sessionId: session.id as string,
                          },
                          create: {
                            sessionId: session.id as string,
                            key: key as string,
                            expires: new Date(
                              new Date().getTime() + 24 * 60 * 60 * 1000,
                            ),
                            url: downloadUrl,
                            activated: new Date(),
                          },
                        },
                      },
                    },
                  },
                },
              },
            });

            if (!userOrder) {
              throw new Error("Failed to create user order");
            }

            revalidatePath(`/order-success`);
          } else {
            const order = await prisma.customer.update({
              where: {
                stripeCustomerId: session.customer as string,
              },
              data: {
                orders: {
                  upsert: {
                    where: {
                      sessionId: session.id as string,
                    },
                    create: {
                      sessionId: session.id as string,
                      status: paymentIntent.status,
                      email: session.customer_details?.email,
                      total: session.amount_total as number,
                      currency: session.currency,
                      paymentIntentId: paymentIntent.id,
                      quantity: Number(session.metadata?.quantity),
                      productPrice: session.amount_subtotal as number,
                      paymentMethodType: paymentIntent.payment_method_types[0],
                      paymentMethodId: paymentIntent.payment_method as string,
                      productName: session.metadata?.product as string,
                      downloads: {
                        connectOrCreate: {
                          where: {
                            sessionId: session.id as string,
                          },
                          create: {
                            sessionId: session.id as string,
                            key: key as string,
                            expires: new Date(
                              new Date().getTime() + 24 * 60 * 60 * 1000,
                            ),
                            url: downloadUrl,
                            activated: new Date(),
                          },
                        },
                      },
                    },
                    update: {
                      status: paymentIntent.status,
                      email: session.customer_details?.email,
                      total: session.amount_total as number,
                      currency: session.currency,
                      paymentIntentId: paymentIntent.id,
                      quantity: Number(session.metadata?.quantity),
                      productPrice: session.amount_subtotal as number,
                      paymentMethodType: paymentIntent.payment_method_types[0],
                      paymentMethodId: paymentIntent.payment_method as string,
                      productName: session.metadata?.product as string,
                      downloads: {
                        connectOrCreate: {
                          where: {
                            sessionId: session.id as string,
                          },
                          create: {
                            sessionId: session.id as string,
                            key: key as string,
                            expires: new Date(
                              new Date().getTime() + 24 * 60 * 60 * 1000,
                            ),
                            url: downloadUrl,
                            activated: new Date(),
                          },
                        },
                      },
                    },
                  },
                },
              },
            });

            if (!order) {
              throw new Error("Failed to create customer order");
            }

            revalidatePath(`/order-success`);
          }
        }
        break;

      case "subscription":
        // Retrieve the subscription details from Stripe.
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );

        // Update the user stripe into in our database.
        // Since this is the initial subscription, we need to update
        // the subscription id and customer id.
        await prisma.user.update({
          where: {
            id: session?.metadata?.userId,
          },
          data: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
          },
        });
        break;
    }
  }

  if (event.type === "customer.created") {
    const session = event.data.object as Stripe.Customer;

    try {
      if (!session.email) {
        throw new Error("Customer email not found");
      }

      await prisma.customer.upsert({
        where: {
          email: session.email,
        },
        create: {
          stripeCustomerId: session.id,
          email: session.email,
          name: session.name,
          city: session.address?.city,
          country: session.address?.country,
          zip: session.address?.postal_code,
          phone: session.phone,
          state: session.address?.state,
          addressOne: session.address?.line1,
          addressTwo: session.address?.line2,
        },
        update: {
          stripeCustomerId: session.id,
          name: session.name,
          city: session.address?.city,
          country: session.address?.country,
          zip: session.address?.postal_code,
          phone: session.phone,
          state: session.address?.state,
          addressOne: session.address?.line1,
          addressTwo: session.address?.line2,
        },
      });
    } catch (error) {
      console.error("Customer created error", error);
    }
  }

  return new Response(null, { status: 200 });
}
