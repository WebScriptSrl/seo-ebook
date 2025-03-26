import Image from "next/image";
import Link from "next/link";
import { UserProductOrder } from "@/types";
import { Product, WithContext } from "schema-dts";

import { testimonials } from "@/config/landing";
import { getSellSession, getUserProductOrders } from "@/lib/order";
import { getUsersReviews } from "@/lib/reviews";
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

  const userReviews = await getUsersReviews("APPROVED");
  const reviews = [...userReviews, ...testimonials];
  const ratings = reviews.map((item) => item.rating);
  const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const jsonLd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Local SEO eBook",
    description:
      "Mastering Local SEO is a comprehensive guide to help you understand and implement local SEO strategies to grow your business.",
    sku: "SEO-BOOK-001",
    image: [
      baseUrl + "/_static/product/mastering-local-seo-pdf-epub-book1x1.png",
      baseUrl + "/_static/product/mastering-local-seo-pdf-epub-book4x3.png",
      baseUrl + "/_static/product/mastering-local-seo-pdf-epub-book16x9.png",
    ],
    brand: {
      "@type": "Brand",
      name: "SEO.eBook",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Local SEO eBook - PDF",
        price: "9.99",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "SEO.eBook",
        },
      },
      {
        "@type": "Offer",
        name: "Local SEO eBook - ePub",
        price: "9.99",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "SEO.eBook",
        },
      },
      {
        "@type": "Offer",
        name: "Local SEO eBook - Print Ready",
        price: "9.99",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "SEO.eBook",
        },
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating,
      reviewCount: ratings.length,
    },
    review: reviews.map((item) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: item.name,
      },
      reviewRating: {
        "@type": "Rating",
        bestRating: 5,
        ratingValue: item.rating,
        worstRating: 1,
      },
      reviewBody: item.review,
    })),
  };

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
