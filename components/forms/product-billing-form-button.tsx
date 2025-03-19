"use client";

import { useTransition } from "react";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { ProductOrder, UserProductOrder } from "@/types";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface BillingFormButtonProps {
  offer: ProductOrder;
  productOrder?: UserProductOrder;
}

export function ProductBillingFormButton({
  offer,
  productOrder,
}: BillingFormButtonProps) {
  let [isPending, startTransition] = useTransition();
  const generateUserStripeSession = generateUserStripe.bind(
    null,
    "payment",
    offer.stripeId,
  );

  const stripeSessionAction = () =>
    startTransition(async () => await generateUserStripeSession());

  const userOffer = !productOrder
    ? false
    : productOrder.stripePriceId === offer.stripeId;

  return (
    <Button
      variant={userOffer ? "default" : "outline"}
      rounded="full"
      className="w-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> Loading...
        </>
      ) : (
        <>
          {userOffer
            ? "Buy another"
            : offer
              ? offer.title.toLowerCase().includes("pdf")
                ? "Buy PDF Ebook"
                : offer.title.toLowerCase().includes("epub")
                  ? "Buy EPub Ebook"
                  : offer.title.toLowerCase().includes("print")
                    ? "Buy Print Ready"
                    : "Buy"
              : "Buy"}
        </>
      )}
    </Button>
  );
}
