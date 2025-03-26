import { redirect } from "next/navigation";
import { ReviewState } from "@prisma/client";

import { siteConfig } from "@/config/site";
import { countGroupedReviews, getGroupedPaginatedReviews } from "@/lib/reviews";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/dashboard/header";
import { PaginationWithLinks } from "@/components/layout/link-pagination";
import {
  AdminReviewsInfo,
  ReviewWithUser,
} from "@/components/pricing/admin-reviews";
import { Icons } from "@/components/shared/icons";

export const metadata = constructMetadata({
  title: "Admin Reviews – Local SEO eBook",
  description: "Admin panel for managing the reviews.",
});

export default async function AdminReviewsPage({
  params,
  searchParams,
}: {
  params: Record<string, string | string[]>;
  searchParams: Record<string, string>;
}) {
  const user = await getCurrentUser();

  const { page, limit, state } = searchParams;

  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 5;
  const currentState = state ? (state.toUpperCase() as ReviewState) : "PENDING";

  const reviewsCount = await countGroupedReviews(currentState);
  let userReviews: ReviewWithUser[] = [];
  if (user && user.id && user.role === "ADMIN") {
    userReviews = await getGroupedPaginatedReviews({
      page: currentPage,
      limit: currentLimit,
      state: currentState,
    });
  } else {
    redirect("/login");
  }

  const path = "/admin/reviews";

  return (
    <>
      <DashboardHeader
        heading="Admin Reviews"
        text="Admin panel for managing and moderating the reviews."
      />
      <div className="grid gap-8">
        <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>Manage your reviews!</AlertTitle>
          <AlertDescription className="text-balance">
            Link to moderate reviews on{" "}
            <a
              href={siteConfig.links.amzKindle}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Amazon SEO.eBook
            </a>
            .
          </AlertDescription>
        </Alert>

        <AdminReviewsInfo userReviews={userReviews} pathname={path} />
        <PaginationWithLinks
          page={currentPage}
          pageSearchParam="page"
          pageSize={currentLimit}
          totalCount={reviewsCount ? reviewsCount : 0}
          pageSizeSelectOptions={{
            pageSizeOptions: [5, 10, 20],
            pageSizeSearchParam: "limit",
          }}
        />
      </div>
    </>
  );
}
