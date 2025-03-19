import * as React from "react";
import Link from "next/link";
import { Order } from "@prisma/client";

import { UserProductOrder, UserSubscriptionPlan } from "types";
import { cn, formatDate } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomerPortalButton } from "@/components/forms/customer-portal-button";

import { OrderDetailData } from "../orders/order-details";
import { Separator } from "../ui/separator";

interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  userProductOrders: UserProductOrder[];
}

export type UserOrderData = OrderDetailData & {
  orderUrl: string;
};

export function OrdersInfo({ userProductOrders }: BillingInfoProps) {
  const orderData: UserOrderData[] = userProductOrders.map((order: Order) => ({
    "order date": order.createdAt.toLocaleString(),
    product: order.productName ? order.productName : "Local SEO Book",
    price: `${order.productPrice / 100} ${order.currency?.toUpperCase()}`,
    quantity: `${order.quantity} x ${order.productName}`,
    discount: order.discount
      ? order.discount / 100 + " " + order.currency!.toUpperCase()
      : null,
    "amount paid": order.total / 100 + " " + order.currency!.toUpperCase(),
    "coupon code": order.discountCode,
    "promo code": "EBOOK6",
    status: order.status === "succeeded" ? "Paid" : order.status,
    "payment method": order.paymentMethodType,
    currency: order.currency ? order.currency.toUpperCase() : "USD",
    orderUrl: `/order-success?session_id=${order.sessionId}`,
    email: order.email,
  }));
  return (
    <>
      {userProductOrders && userProductOrders.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
            <CardDescription>
              You have {userProductOrders.length} orders.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>
            <ul className="space-y-2 text-sm">
              {orderData.map((order, index) => (
                <li
                  key={index}
                  className="space-y-2 rounded-lg bg-accent md:p-2"
                >
                  <Card className="space-y-2 py-2">
                    {Object.entries(order)
                      .filter(
                        ([key, value]) => key !== "orderUrl" && key !== "email",
                      )
                      .map(([key, value], index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex max-w-[80%] flex-col rounded-lg px-2 py-1 md:mx-auto md:max-w-[60%] md:flex-row md:justify-between",
                            index % 2 === 0 ? "bg-accent" : "bg-accent-light",
                            key === "amount paid"
                              ? "text-gradient_indigo-purple"
                              : "",
                            key === "discount" ? "text-gradient_cyan-red" : "",
                            key.includes("code")
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
                    <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-center md:space-y-0">
                      <Link href={order.orderUrl}>
                        <Button>View Order</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-center md:space-y-0">
            <Link href={"/pricing"}>
              <Button>Products</Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>You have no orders yet !</CardTitle>
            <CardDescription>
              Check out our <span className="text-primary">Local SEO book</span>{" "}
              and get started!
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-between md:space-y-0">
            <Link href={"/pricing"}>
              <Button>Order a book</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
