import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";
import { CardSkeleton } from "@/components/shared/card-skeleton";

export default function DashboardReviewsLoading() {
  return (
    <>
      <DashboardHeader
        heading="Reviews"
        text="Leave a review for the Local SEO eBook."
      />
      <div className="grid gap-8">
        <Skeleton className="h-28 w-full rounded-lg md:h-24" />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </>
  );
}
