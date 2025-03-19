import { redirect } from "next/navigation";

import { getOrdersByEmail, getUserProductOrders } from "@/lib/order";
import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingInfo } from "@/components/pricing/billing-info";
import { OrdersInfo } from "@/components/pricing/orders-info";
import { Icons } from "@/components/shared/icons";

export const metadata = constructMetadata({
  title: "Billing and Orders – Local SEO eBook",
  description: "Manage your orders and billing information for SEO eBooks.",
});

export default async function BillingPage() {
  const user = await getCurrentUser();

  let userSubscriptionPlan;
  let userOrders;
  if (user && user.id && user.email && user.role === "USER") {
    userSubscriptionPlan = await getUserSubscriptionPlan(user.id);
    userOrders = await getOrdersByEmail(user.email);
  } else {
    redirect("/login");
  }

  return (
    <>
      <DashboardHeader
        heading="Billing & Orders"
        text="Manage your orders and billing information."
      />
      <div className="grid gap-8">
        <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>Direct payments only !</AlertTitle>
          <AlertDescription className="text-balance">
            Only your orders via direct payment on our website will be displayed
            here. For orders via Amazon, please check your Amazon account.
            <p>
              But you ca still{` `}
              <a
                href="/dashboard/reviews"
                className="font-medium underline underline-offset-8"
              >
                leave a review
              </a>
              {` `}
              for any product you bought.
            </p>
          </AlertDescription>
        </Alert>
        {/* Subcription not implemented  */}
        {/* <BillingInfo userSubscriptionPlan={userSubscriptionPlan} /> */}
        <OrdersInfo userProductOrders={userOrders} />
      </div>
    </>
  );
}
