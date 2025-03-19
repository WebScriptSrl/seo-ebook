import { Order } from "@prisma/client";

import { getConfirmedOrders } from "@/lib/order";
import { OrderDetails } from "@/components/orders/order-details";
import OrderSuccess from "@/components/orders/order-success";
import CTALandingPreview from "@/components/shared/cta-landing-preview";
import InvalidCTA from "@/components/shared/invalid-cta";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { session_id } = searchParams;

  if (!session_id) {
    return (
      <>
        <InvalidCTA
          data={{
            titleCta: "A valid order ID is missing !",
            title: "Order Confirmation",
            descriptionStart: "We did not receive a valid order ID for",
            strongTxt: "SEO.eBook.",
            descriptionEnd:
              "Please try again or contact us for further assistance.",
            btnText: "Pricing",
            url: "/pricing",
          }}
        />
        <CTALandingPreview />
      </>
    );
  }

  return (
    <>
      <OrderSuccess sessionId={session_id} />
      <CTALandingPreview />
    </>
  );
}
