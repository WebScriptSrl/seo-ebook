import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function OrdersLoading() {
  return (
    <>
      <DashboardHeader heading="Products" text="Manage your products." />
      <Skeleton className="size-full rounded-lg" />
    </>
  );
}
