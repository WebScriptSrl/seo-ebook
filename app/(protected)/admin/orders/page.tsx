import Link from "next/link";
import { redirect } from "next/navigation";

import { countOrders, getPaginatedOrders } from "@/lib/order";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { PaginationWithLinks } from "@/components/layout/link-pagination";
import { AdminOrdersInfo } from "@/components/orders/admin-orders";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "Orders – Local SEO eBook",
  description: "Check and manage your latest orders.",
});

export default async function OrdersPage({
  params,
  searchParams,
}: {
  params: Record<string, string | string[]>;
  searchParams: Record<string, string>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const { page, limit } = searchParams;

  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 5;

  const ordersCount = await countOrders();
  const orders = await getPaginatedOrders({
    page: currentPage,
    limit: currentLimit,
  });

  return (
    <>
      <DashboardHeader
        heading="Orders"
        text="Check and manage your store orders."
      />
      {ordersCount && ordersCount > 0 && orders ? (
        <div className="flex flex-col gap-5">
          <AdminOrdersInfo userProductOrders={orders} count={ordersCount} />
          <PaginationWithLinks
            page={currentPage}
            pageSearchParam="page"
            pageSize={currentLimit}
            totalCount={ordersCount}
            pageSizeSelectOptions={{
              pageSizeOptions: [5, 10, 20],
              pageSizeSearchParam: "limit",
            }}
          />
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="package" />
          <EmptyPlaceholder.Title>No orders listed</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any orders yet. Start your marketing campaign to
            get your first order.
          </EmptyPlaceholder.Description>
          <Link href="/guides">
            <Button>Start marketing</Button>
          </Link>
        </EmptyPlaceholder>
      )}
    </>
  );
}
