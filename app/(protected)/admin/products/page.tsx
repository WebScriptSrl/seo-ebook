import { redirect } from "next/navigation";

import { countProducts, getGroupedPaginatedProducts } from "@/lib/products";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { PaginationWithLinks } from "@/components/layout/link-pagination";
import { AdminProductsInfo } from "@/components/pricing/product-manager";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "Admin Products – Local SEO eBook",
  description: "Manage your database of products.",
});

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Record<string, string | string[]>;
  searchParams: Record<string, string>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const { page, limit, type } = searchParams;

  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 5;
  const currentType = type || "all";

  const path = "/admin/products";

  const productsCount = await countProducts();

  const products = await getGroupedPaginatedProducts({
    page: currentPage,
    limit: currentLimit,
    type: currentType,
  });

  return (
    <>
      <DashboardHeader heading="Products" text="Manage your products." />
      <AdminProductsInfo
        products={products}
        pathname={path}
        productsCount={productsCount}
      />
      <PaginationWithLinks
        page={currentPage}
        pageSearchParam="page"
        pageSize={currentLimit}
        totalCount={
          currentType === "all"
            ? productsCount
              ? productsCount
              : products
                ? products.length
                : 0
            : products
              ? products.length
              : 0
        }
        pageSizeSelectOptions={{
          pageSizeOptions: [5, 10, 20],
          pageSizeSearchParam: "limit",
        }}
      />
    </>
  );
}
