import NewsletterCTA from "@/components/newsletter/newsletter-cta";
import NewsletterLandingPreview from "@/components/newsletter/newsletter-landing-preview";
import InvalidCTA from "@/components/shared/invalid-cta";

export default function ConfirmNewsletterSubscriptionPage({
  searchParams,
}: {
  searchParams: { vTok: string };
}) {
  const validationToken = searchParams.vTok;

  if (!validationToken) {
    return (
      <>
        <InvalidCTA
          data={{
            titleCta: "A valid token is missing !",
            title: "Newsletter Subscription",
            descriptionStart: "We did not receive a valid token for",
            strongTxt: "SEO.eBook newsletter subscription.",
            descriptionEnd:
              "Please try again or contact us for further assistance.",
            btnText: "Home",
            url: "/",
          }}
        />
        <NewsletterLandingPreview />
      </>
    );
  }

  return (
    <>
      {validationToken ? (
        <>
          <NewsletterCTA
            data={{
              titleCta: "Confirm your subscription !",
              title: "Newsletter Subscription",
              descriptionStart: "You are just one step away from",
              strongTxt: "news, updates, tips, and tricks",
              descriptionEnd: "from SEO.eBook website.",
              btnText: "Confirm",
              url: `/newsletter-subscription-confirmed`,
              token: validationToken,
              isValid: validationToken ? true : false,
            }}
          />
          <NewsletterLandingPreview />
        </>
      ) : (
        <>
          <NewsletterCTA
            data={{
              titleCta: "A valid token is missing !",
              title: "Newsletter Subscription",
              descriptionStart: "We did not receive a valid token for",
              strongTxt: "SEO.eBook newsletter subscription.",
              descriptionEnd:
                "Please try again or contact us for further assistance.",
              btnText: "Home",
              url: "/",
              isValid: validationToken ? true : false,
            }}
          />
          <NewsletterLandingPreview />
        </>
      )}
    </>
  );
}
