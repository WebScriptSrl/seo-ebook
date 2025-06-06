import { redirect } from "next/navigation";

import { getGroupedPaidOrders } from "@/lib/order";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import SubscribersList from "@/components/dashboard/newsletter-list";
import TransactionsList from "@/components/dashboard/transactions-list";
import UserList from "@/components/dashboard/user-list";

export const metadata = constructMetadata({
  title: "Admin – Local SEO eBook",
  description: "Admin panel for managing the application.",
});

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const ordersInfo = await getGroupedPaidOrders();

  return (
    <>
      <DashboardHeader
        heading="Admin Panel"
        text="Access only for users with ADMIN role."
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            title="Orders %"
            value={ordersInfo ? ordersInfo.difference : 0}
            percentage={ordersInfo ? ordersInfo.percentage : 0}
          />
          <InfoCard
            title="Total Orders"
            value={ordersInfo?.totalOrders}
            difference={ordersInfo?.difference}
          />
          <InfoCard
            title="Sales"
            value={ordersInfo?.total ? ordersInfo?.total / 100 : 0}
            percentage={ordersInfo?.amountPercentage}
          />
          <InfoCard
            title="All time"
            value={
              ordersInfo?.allTimeTotal ? ordersInfo?.allTimeTotal / 100 : 0
            }
            totalOrders={ordersInfo?.allTime}
          />
        </div>
        <TransactionsList page={1} limit={20} />
        <UserList page={1} limit={20} />
        <SubscribersList page={1} limit={20} />
      </div>
    </>
  );
}
