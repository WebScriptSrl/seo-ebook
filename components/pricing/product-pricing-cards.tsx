"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { ProductOrder, UserProductOrder } from "@/types";
import { SellSession } from "@prisma/client";

import { amazonProductData, directProductData } from "@/config/products";
import { siteConfig } from "@/config/site";
import { cn, placeholderBlurhash } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ProductBillingFormButton } from "@/components/forms/product-billing-form-button";
// import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

import BlurImage from "../shared/blur-image";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface ProductPricingCardsProps {
  userId?: string;
  productOrder?: UserProductOrder;
  defaultOrderType: "download" | "amazon";
  sellSession?: SellSession | null;
}

export function ProductPricingCards({
  //userId, // Not used for now
  productOrder,
  defaultOrderType,
  sellSession,
}: ProductPricingCardsProps) {
  const isDirectlyDefault = defaultOrderType === "download" ? true : false;
  const [isDirect, setIsDirect] = useState<boolean>(!!isDirectlyDefault);
  // const { setShowSignInModal } = useContext(ModalContext); // Not used for now

  const [sellOpenData, setSellOpenData] = useState<SellSession | null>(null);
  const [sellPaused, setSellPaused] = useState<boolean | undefined>(
    sellSession?.sellStop,
  );

  const toggleBilling = () => {
    setIsDirect(!isDirect);
  };

  useEffect(() => {
    if (sellSession) {
      setSellOpenData(sellSession);
      setSellPaused(sellSession.sellStop === true);
    }
  }, [sellSession]);

  const PricingCard = ({ offer }: { offer: ProductOrder }) => {
    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden rounded-3xl border shadow-sm",
          offer.title.toLocaleLowerCase() === "pdf ebook" ||
            offer.title.toLocaleLowerCase() === "kindle ebook"
            ? "-m-0.5 border-2 border-purple-400"
            : "",
        )}
        key={offer.title}
      >
        <div className="min-h-[150px] items-start space-y-4 bg-muted/50 p-6">
          <p className="text-gradient_cyan-red flex w-fit font-urban text-sm font-bold uppercase tracking-wider">
            {offer.title}
          </p>

          <div className="flex flex-row">
            <div className="flex items-end">
              <div className="flex text-left text-3xl font-semibold leading-6">
                {offer.price.discount ? (
                  <>
                    <span className="mr-2 text-muted-foreground/80 line-through">
                      ${offer.price.full}
                    </span>
                    <span>${offer.price.full - offer.price.discount}</span>
                  </>
                ) : (
                  `$${offer.price.full}`
                )}
              </div>
              <div className="-mb-1 ml-2 text-left text-sm font-medium text-muted-foreground">
                <div>/ book</div>
              </div>
            </div>
          </div>
          {offer.price.discount ? (
            <div className="text-left text-sm text-muted-foreground">
              {isDirect
                ? `- $${offer.price.discount} discount for ${offer.title}`
                : `- $${offer.price.discount} for ${offer.title}`}
            </div>
          ) : (
            <div className="text-left text-sm text-muted-foreground">
              {isDirect ? `Download our ${offer.title}` : "Order from Amazon"}
            </div>
          )}
        </div>

        {offer.image && (
          <BlurImage
            alt={offer.title}
            blurDataURL={placeholderBlurhash}
            src={offer.image}
            width={0}
            height={0}
            className="w-full object-cover object-center"
            placeholder="blur"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        <div className="flex h-full flex-col justify-between gap-16 p-6">
          <ul className="space-y-2 text-left text-sm font-medium leading-normal">
            {offer.benefits.map((feature) => (
              <li className="flex items-start gap-x-3" key={feature}>
                <Icons.check className="size-5 shrink-0 text-purple-500" />
                <p className="max-w-[45ch]">{feature}</p>
              </li>
            ))}

            {offer.limitations.length > 0 &&
              offer.limitations.map((feature) => (
                <li
                  className="flex items-start text-muted-foreground"
                  key={feature}
                >
                  <Icons.close className="mr-3 size-5 shrink-0" />
                  <p className="max-w-[45ch]">{feature}</p>
                </li>
              ))}
          </ul>

          {offer.type === "download" && offer.stripeId ? (
            <>
              {!sellPaused ? (
                <ProductBillingFormButton
                  offer={offer}
                  productOrder={productOrder}
                />
              ) : (
                <Alert variant="default" className="text-center">
                  <Icons.info className="inline-block size-5" />
                  {sellOpenData?.showBanner &&
                  sellOpenData?.bannerTitle &&
                  sellOpenData?.description ? (
                    <div>
                      <AlertTitle className="text-sm text-muted-foreground">
                        {sellOpenData.bannerTitle}
                      </AlertTitle>
                      <AlertDescription className="text-xs text-muted-foreground">
                        {sellOpenData.description}
                      </AlertDescription>
                    </div>
                  ) : (
                    <div>
                      <AlertTitle className="text-sm text-muted-foreground">
                        The sell session is paused.
                      </AlertTitle>
                      <AlertDescription className="text-xs text-muted-foreground">
                        We are working on it! Please check back later.
                      </AlertDescription>
                    </div>
                  )}
                </Alert>
              )}
            </>
          ) : (
            <Link
              href={offer.amzUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  rounded: "full",
                }),
                "w-full",
              )}
            >
              {offer.title === "Kindle Ebook"
                ? "Buy Kindle EBook"
                : "Buy on Amazon"}
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <MaxWidthWrapper>
      <section className="flex flex-col items-center text-center">
        <HeaderSection
          label="Pricing"
          title="Upgrade your SEO skills today !"
        />

        <div className="mb-4 mt-10 flex items-center gap-5">
          <ToggleGroup
            type="single"
            size="sm"
            defaultValue={isDirect ? "download" : "amazon"}
            onValueChange={toggleBilling}
            aria-label="toggle-order-type"
            className="h-9 overflow-hidden rounded-full border bg-background p-1 *:h-7 *:text-muted-foreground"
          >
            <ToggleGroupItem
              value="download"
              className="rounded-full px-5 data-[state=on]:pointer-events-none data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground"
              aria-label="Toggle download billing"
            >
              {`Download (-$${directProductData[0].price.discount})`}
            </ToggleGroupItem>
            <ToggleGroupItem
              value="amazon"
              className="rounded-full px-5 data-[state=on]:pointer-events-none data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground"
              aria-label="Toggle Amazon billing"
            >
              Amazon
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid gap-5 bg-inherit py-5 lg:grid-cols-3">
          {isDirect
            ? directProductData.map((offer) => (
                <PricingCard offer={offer} key={offer.title} />
              ))
            : amazonProductData.map((offer) => (
                <PricingCard offer={offer} key={offer.title} />
              ))}
        </div>

        <p className="mt-3 text-balance text-center text-base text-muted-foreground">
          Email{" "}
          <a
            className="font-medium text-primary hover:underline"
            href={`mailto:${siteConfig.mailSupport}`}
          >
            {siteConfig.mailSupport}
          </a>{" "}
          to contact our support team.
          <br />
          <strong>You need onother book format? Contact us!</strong>
        </p>
      </section>
    </MaxWidthWrapper>
  );
}
