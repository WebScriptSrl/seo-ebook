import { redirect } from "next/navigation";

import { siteConfig } from "@/config/site";
import { getUserProductOrders } from "@/lib/order";
import { getUserReviews } from "@/lib/reviews";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/dashboard/header";
import { AddReviewForm } from "@/components/forms/add-review-form";
import { ReviewsInfo } from "@/components/pricing/reviews-info";
import { Icons } from "@/components/shared/icons";

export const metadata = constructMetadata({
  title: "Reviews – Local SEO eBook",
  description: "Leave a review for the Local SEO eBook.",
});

export default async function ReviewsPage() {
  const user = await getCurrentUser();

  let userOrders;
  let userReviews;
  if (user && user.id && user.role === "USER") {
    userOrders = await getUserProductOrders(user.id);
    userReviews = await getUserReviews(user.id);
  } else {
    redirect("/login");
  }

  const path = "/dashboard/reviews";

  return (
    <>
      <DashboardHeader
        heading="Reviews"
        text="Leave a review for the Local SEO eBook."
      />
      <div className="grid gap-8">
        <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>Bought the book on Amazon?</AlertTitle>
          <AlertDescription className="text-balance">
            Even if you bought the book on Amazon, you can still leave a review
            here. Or, you can leave a review on the product page:{" "}
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

        <AddReviewForm userOrders={userOrders} user={user.id} />
        <ReviewsInfo userReviews={userReviews} pathname={path} />
      </div>
    </>
  );
}
