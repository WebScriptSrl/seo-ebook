import Link from "next/link";
import { redirect } from "next/navigation";

import { getOrdersByEmail, getUserProductOrders } from "@/lib/order";
import { getUserReviews } from "@/lib/reviews";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { OrdersInfo } from "@/components/pricing/orders-info";
import { ReviewsInfo } from "@/components/pricing/reviews-info";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "Dashboard – Local SEO eBook",
  description:
    "Manage your account, orders and add reviews for Local SEO eBooks.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  let userOrders;
  let userReviews;
  if (user && user.id && user.email && user.role === "USER") {
    userOrders = await getOrdersByEmail(user.email);
    userReviews = await getUserReviews(user.id);
  } else {
    redirect("/login");
  }

  const path = "/dashboard";

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text={`Hello, ${user.name ? user.name : "future SEO master"} !`}
      />

      {/* Reviews */}
      {userReviews.length > 0 ? (
        <ReviewsInfo userReviews={userReviews} pathname={path} />
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>
            You don&apos;t have any reviews yet !
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            If you bought a product, please{" "}
            <span className="text-primary">leave a review</span> to help others
            decide. You can also leave a review on the product page{" "}
            <span className="text-primary">on Amazon</span>.
          </EmptyPlaceholder.Description>
          <Link href={"/dashboard/reviews"}>
            <Button>Add a Review</Button>
          </Link>
        </EmptyPlaceholder>
      )}

      {/* Orders */}
      {userOrders && userOrders.length > 0 ? (
        <OrdersInfo userProductOrders={userOrders} />
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="logo" />
          <EmptyPlaceholder.Title>
            You have no orders yet !
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Check out our <span className="text-primary">Local SEO book</span>{" "}
            and get started!
          </EmptyPlaceholder.Description>
          <Link href={"/pricing"}>
            <Button>Products</Button>
          </Link>
        </EmptyPlaceholder>
      )}
    </>
  );
}
