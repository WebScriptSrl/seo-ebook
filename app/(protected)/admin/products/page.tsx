import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "Products – Local SEO eBook",
  description: "Manage your database of products.",
});

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <>
      <DashboardHeader heading="Products" text="Manage your products." />
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="add" />
        <EmptyPlaceholder.Title>No products listed</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any products yet. Start adding a product.
        </EmptyPlaceholder.Description>
        <Button>Add Products</Button>
      </EmptyPlaceholder>
    </>
  );
}
