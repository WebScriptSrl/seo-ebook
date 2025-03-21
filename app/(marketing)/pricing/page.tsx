import Image from "next/image";
import Link from "next/link";
import { UserProductOrder } from "@/types";

import { getSellSession, getUserProductOrders } from "@/lib/order";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { CompareProducts } from "@/components/pricing/compare-products";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { ProductPricingCards } from "@/components/pricing/product-pricing-cards";

export const metadata = constructMetadata({
  title: "Book Pricing | Mastering Local SEO",
  description:
    "Explore our Local SEO books various formats and choose the one that suits you the best.",
});

export default async function PricingPage() {
  const user = await getCurrentUser();

  if (user?.role === "ADMIN") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-evenly gap-8 py-8">
        <h1 className="text-5xl font-bold">Seriously?</h1>
        <Image
          src="/_static/illustrations/waiting.svg"
          alt="403"
          width={560}
          height={560}
          className="pointer-events-none -my-20 dark:invert"
        />
        <p className="text-balance px-4 text-center text-2xl font-medium">
          You are an {user.role}. Back to{" "}
          <Link
            href="/admin"
            className="text-muted-foreground underline underline-offset-4 hover:text-purple-500"
          >
            Dashboard
          </Link>
          .
        </p>
      </div>
    );
  }

  // Subscription implementation at a later stage
  // let subscriptionPlan: UserSubscriptionPlan | undefined;
  let productOrder: UserProductOrder | undefined;
  if (user && user.id) {
    // subscriptionPlan = await getUserSubscriptionPlan(user.id);
    productOrder = await getUserProductOrders(user.id);
  }

  const sellSession = await getSellSession();

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <ProductPricingCards
        userId={user?.id}
        productOrder={productOrder}
        defaultOrderType="download"
        sellSession={sellSession}
      />
      <hr className="container" />
      <CompareProducts />
      <PricingFaq />
    </div>
  );
}
