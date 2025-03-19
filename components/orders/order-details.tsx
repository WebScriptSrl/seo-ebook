"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Order } from "@prisma/client";

import { getConfirmedOrders } from "@/lib/order";
import { cn } from "@/lib/utils";

import { EmptyPlaceholder } from "../shared/empty-placeholder";
import { Icons } from "../shared/icons";
import { buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";

export type OrderDetailData = {
  email: string | null;
  "payment method": string | null;
  quantity: string;
  price: string;
  product: string;
  status: string;
  currency: string;
  discount: string | null;
  "amount paid": string;
  "coupon code": string | null;
  "promo code": string;
};

export const OrderDetails = ({ id }: { id: string }) => {
  const [order, setOrder] = useState<Order>({} as Order);
  const [loading, setLoading] = useState(true);
  const [receiptUrl, setReceiptUrl] = useState<string | null>();
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>();
  const [invoicePdf, setInvoicePdf] = useState<string | null>();
  const [orderDate, setOrderDate] = useState<string | undefined>(undefined);
  const [displayData, setDisplayData] = useState<OrderDetailData>(
    {} as OrderDetailData,
  );

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await getOrder();
      if (!response) {
        setLoading(false);
        return;
      }
      setReceiptUrl(response.receiptUrl);
      setInvoiceUrl(response.hostedInvoiceUrl);
      setInvoicePdf(response.invoicePdf);
      setOrderDate(response.createdAt.toLocaleString());
      setOrder(response);
      setDisplayData({
        email: response.email,
        "payment method": response.paymentMethodType,
        quantity: response.quantity + " x " + response.productName,
        price:
          response.productPrice / 100 + " " + response.currency?.toUpperCase(),
        "amount paid":
          response.total / 100 + " " + response.currency!.toUpperCase(),
        discount: response.discount
          ? response.discount / 100 + " " + response.currency!.toUpperCase()
          : null,
        product: response.productName
          ? response.productName
          : "Local SEO eBook",
        status: response.status,
        currency: response.currency ? response.currency.toUpperCase() : "USD",

        "coupon code": response.discountCode,
        "promo code": "EBOOK6",
      });
      setLoading(false);
    };

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    setReceiptUrl,
    setInvoiceUrl,
    setInvoicePdf,
    setOrderDate,
    setLoading,
  ]);

  const getOrder = async () => {
    const response = await getConfirmedOrders(id);
    console.log(response);
    return response;
  };

  return (
    <section className="space-y-2 pb-7 sm:py-5 md:space-y-5 lg:py-10">
      <Separator className="mx-auto w-1/2" />

      {loading ? (
        <EmptyPlaceholder className="min-h-96">
          <p
            className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-lg sm:leading-8"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            Loading order details...
          </p>
          <Icons.spinner className="size-8 animate-spin" />
        </EmptyPlaceholder>
      ) : (
        <div className="container flex w-full max-w-5xl flex-col items-center gap-8 px-5 pt-10 text-center">
          <p
            className="text-gradient_indigo-purple max-w-2xl text-balance leading-normal sm:text-lg sm:leading-8"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            Here&apos;s your order summary:
          </p>

          <div
            className="flex w-full flex-col justify-evenly gap-5 space-x-2 md:flex-row md:space-x-4"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            <ul className="flex flex-col gap-2 px-8 text-left">
              {Object.entries(displayData).map(([key, value], i) => (
                <li
                  key={key}
                  className={cn(
                    key.includes("code") ? "text-gradient_cyan-red" : "",
                    key === "discount" ? "text-gradient_cyan-red" : "",
                    "flex gap-4 text-sm",
                  )}
                >
                  <strong className="capitalize italic text-muted-foreground">
                    {key}:
                  </strong>{" "}
                  {value}
                </li>
              ))}
              <li className="flex gap-4 text-sm">
                <strong className="italic text-muted-foreground">Date:</strong>{" "}
                {orderDate}
              </li>
            </ul>

            <div className="flex flex-col gap-2">
              {invoiceUrl && (
                <Link
                  href={invoiceUrl}
                  target="_blank"
                  prefetch={true}
                  className={cn(
                    buttonVariants({ size: "lg", rounded: "full" }),
                    "gap-2",
                  )}
                >
                  <span>View Invoice</span>
                  <Icons.arrowRight className="size-4" />
                </Link>
              )}

              {receiptUrl && (
                <Link
                  href={receiptUrl}
                  target="_blank"
                  prefetch={true}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                      rounded: "full",
                    }),
                    "px-5",
                  )}
                >
                  <Icons.logo className="mr-2 size-4" />
                  <p>
                    <span className="font-bold">View Receipt</span>{" "}
                  </p>
                  <Icons.arrowRight className="ml-2 size-4" />
                </Link>
              )}

              {invoicePdf && (
                <Link
                  href={invoicePdf}
                  target="_blank"
                  prefetch={true}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                      rounded: "full",
                    }),
                    "px-5",
                  )}
                >
                  <Icons.logo className="mr-2 size-4" />
                  <p>
                    <span className="font-bold">Download Invoice</span>{" "}
                  </p>
                  <Icons.arrowRight className="ml-2 size-4" />
                </Link>
              )}
            </div>
          </div>

          <Separator className="mx-auto w-1/2 lg:w-full" />

          <p className="text-sm text-muted-foreground">
            This page can be accessed at any time from the email we sent you at{" "}
            <strong>{order.email}</strong>
          </p>

          <p className="text-gradient_cyan-red">
            Enjoy your reading, and happy learning !{" "}
          </p>
          <Link
            href={"/"}
            prefetch={true}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "px-5",
            )}
          >
            <Icons.logo className="mr-2 size-4" />
            <p>
              <span className="font-bold">Home</span>{" "}
            </p>
            <Icons.arrowRight className="ml-2 size-4" />
          </Link>
        </div>
      )}
    </section>
  );
};
