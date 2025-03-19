import * as React from "react";
import Link from "next/link";

import { UserProductOrder, UserSubscriptionPlan } from "types";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  userProductOrders: UserProductOrder[];
  count?: number;
}

export type AdminOrderData = {
  id: string;
  product: string;
  status: string;
  date: string;
  paid: string;
  discount?: string | null;
  currency: string;
  "payment method": string | null;
  invoice: string | null;
  "pdf invoice": string | null;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  state?: string;
  zip?: string;
  "download count": number;
  used: string;
  "download expires": string | null;
  activated: string | null;
};

export function AdminOrdersInfo({
  userProductOrders,
  count,
}: BillingInfoProps) {
  const orderData: AdminOrderData[] = userProductOrders.map((order) => ({
    id: order.id,
    date: order.createdAt.toLocaleString(),
    product: order.productName ? order.productName : "Local SEO Book",
    paid: `${order.total / 100} ${order.currency?.toUpperCase()}`,
    discount: order.discount
      ? order.discount / 100 + " " + order.currency!.toUpperCase()
      : null,
    status: order.status === "succeeded" ? "Paid" : order.status,
    "payment method": order.paymentMethodType,
    invoice: order.hostedInvoiceUrl,
    "pdf invoice": order.invoicePdf,
    currency: order.currency ? order.currency.toUpperCase() : "USD",
    name: order.customer.name,
    email: order.customer.email,
    phone: order.customer.phone,
    address:
      order.customer.addressOne + " " + order.customer.addressTwo
        ? order.customer.addressTwo
        : "",
    city: order.customer.city,
    country: order.customer.country,
    state: order.customer.state,
    zip: order.customer.zip,
    "download count": order.downloads[0]?.downloadCount
      ? order.downloads[0].downloadCount
      : 0,
    used: order.downloads[0]?.used === true ? "true" : "false",
    "download expires": order.downloads[0]?.expires
      ? new Date(order.downloads[0].expires).toLocaleString()
      : null,
    activated: order.downloads[0]?.activated
      ? new Date(order.downloads[0].activated).toLocaleString()
      : null,
  }));
  return (
    <>
      {userProductOrders && userProductOrders.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
            <CardDescription>
              You have {count ? count : userProductOrders.length} orders.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>
            <ul className="space-y-2 text-sm">
              {orderData.map((order, index) => (
                <li
                  key={order.id}
                  className="space-y-2 rounded-lg bg-accent md:p-2"
                >
                  <Card className="space-y-2 py-2">
                    {Object.entries(order)
                      .filter(
                        ([key, value]) =>
                          key !== "pdf invoice" &&
                          key !== "invoice" &&
                          key !== "id" &&
                          value !== null,
                      )
                      .map(([key, value], index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex max-w-[80%] flex-col rounded-lg px-2 py-1 md:mx-auto md:max-w-[60%] md:flex-row md:justify-between",
                            index % 2 === 0 ? "bg-accent" : "bg-accent-light",
                            key === "paid" ? "text-gradient_indigo-purple" : "",
                            key === "name" ? "text-gradient_indigo-purple" : "",
                            key === "discount" ? "text-gradient_cyan-red" : "",
                            key.includes("count")
                              ? "text-gradient_cyan-red"
                              : "",
                          )}
                        >
                          <strong className="font-bold capitalize">
                            {key}
                          </strong>
                          <span
                            className={cn(
                              key === "payment method" ? "capitalize" : "",
                            )}
                          >
                            {value}
                          </span>
                        </div>
                      ))}

                    <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-evenly md:space-y-0">
                      {order["pdf invoice"] ? (
                        <Link href={order["pdf invoice"]} target="_blank">
                          <Button variant={"default"}>Download PDF</Button>
                        </Link>
                      ) : null}
                      {order.invoice ? (
                        <Link href={order.invoice} target="_blank">
                          <Button variant={"default"}>View Invoice</Button>
                        </Link>
                      ) : null}
                    </CardFooter>
                  </Card>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
