import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";
import { CardSkeleton } from "@/components/shared/card-skeleton";

export default function AdminReviewsLoading() {
  return (
    <>
      <DashboardHeader
        heading="Admin Reviews"
        text="Admin panel for managing and moderating the reviews."
      />
      <div className="grid gap-8">
        <Skeleton className="h-28 w-full rounded-lg md:h-24" />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </>
  );
}
