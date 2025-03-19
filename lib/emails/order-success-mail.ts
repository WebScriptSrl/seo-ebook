"use server";

import SeoEbookOrderEmail, {
  BillingDetails,
} from "@/emails/book-succesful-order";
import { Order } from "@prisma/client";

import { env } from "@/env.mjs";

import { getCustomerById } from "../customers";
import { prisma } from "../db";
import { resend } from "../resend";

const sendOrderEmail = async (order: Order | null, sessionId: string) => {
  if (order && order.status === "succeeded") {
    const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order-success?session_id=${sessionId}`;
    try {
      const billingDetails = await getCustomerById(order.email as string);
      const customerEmailData: BillingDetails = {
        name: billingDetails?.name,
        email: billingDetails?.email,
        phone: billingDetails?.phone,
        address: `${billingDetails?.addressOne}, ${billingDetails?.addressTwo ? billingDetails?.addressTwo + "," : ""}`,
        city: billingDetails?.city,
        state: billingDetails?.state,
        zip: billingDetails?.zip,
        country: billingDetails?.country,
      };

      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to:
          process.env.NODE_ENV === "development"
            ? "delivered@resend.dev"
            : (order.email as string),
        subject: "SEO.eBook order success",
        react: SeoEbookOrderEmail({
          order: {
            id: order.id,
            product: order.productName as string,
            price:
              order.productPrice / 100 + " " + order.currency?.toUpperCase(),
            quantity: order.quantity + " x " + order.productName,
            status: order.status,
            discount: order.discount
              ? order.discount / 100 + " " + order.currency!.toUpperCase()
              : null,
            currency: order.currency ? order.currency.toUpperCase() : "USD",
            "amount paid":
              order.total / 100 + " " + order.currency!.toUpperCase(),
            "coupon code": order.discountCode,
            "promo code": "EBOOK6",
            "payment method": order.paymentMethodType,
            date: order.createdAt?.toLocaleString(),
            downloadUrl: downloadUrl,
            "billing details": customerEmailData,
            links: [
              {
                name: "View Invoice",
                url: order.hostedInvoiceUrl,
              },
              {
                name: "View Receipt",
                url: order.hostedInvoiceUrl,
              },
              {
                name: "Download Invoice",
                url: order.invoicePdf,
              },
            ],
          },
          siteName: "SEO.eBook",
          baseUrl: env.NEXT_PUBLIC_APP_URL,
        }),
        headers: {
          "X-Entity-Ref-ID": new Date().getTime() + "",
        },
      });

      if (error || !data) {
        throw new Error(error?.message);
      }

      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          emails: {
            upsert: {
              where: {
                emailId: data.id,
              },
              create: {
                emailId: data.id,
                type: "order-success",
                subject: `${order.productName} SEO.eBook order success`,
                emails: [order.email as string],
                sentAt: new Date(),
              },
              update: {
                type: "order-success",
                subject: `${order.productName} SEO.eBook order success`,
                emails: [order.email as string],
                sentAt: new Date(),
              },
            },
          },
        },
      });

      return data;
    } catch (error) {
      throw new Error("Failed to send email");
    }
  }
};

export default sendOrderEmail;
