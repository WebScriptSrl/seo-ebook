"use client";

import { useEffect, useState } from "react";
import { NewsletterState } from "@prisma/client";
import { toast } from "sonner";

import sendSubscriptionEmail from "@/lib/emails/subscription-confirm-mail";
import ConfirmedSusbcriptionCTA from "@/components/newsletter/confirmed-subscription-cta";
import NewsletterLandingPreview from "@/components/newsletter/newsletter-landing-preview";

export default function NewsletterConfirmedPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = searchParams;
  const [subscribed, setSubscribed] = useState<NewsletterState>("PENDING");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Checking subscription status");
  const [unsubscribeToken, setUnsubscribeToken] = useState<string | null>(null);
  const [userMail, setUserMail] = useState<string | null>(null);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(false);

  useEffect(() => {
    if (id) checkSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (sendWelcomeEmail === true) {
      handleSendMail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendWelcomeEmail]);

  const checkSubscription = async () => {
    const res = await fetch(`/api/newsletter/confirm`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        id: id,
      },
    });
    const data = await res.json();
    if (data.subscription) {
      setSubscribed(data.subscription.subscribed);
      setUnsubscribeToken(data.subscription.unsubscribeToken);
      setUserMail(data.subscription.email);
      setSendWelcomeEmail(data.subscription.subscribed === "CONFIRMED");
      setLoading(false);
      return;
    }

    if (data.message) {
      setMessage(data.message);
      setLoading(false);
      return;
    }

    setMessage("");
    setLoading(false);
  };

  const handleSendMail = () => {
    if (sendWelcomeEmail === true && unsubscribeToken && userMail) {
      const promise = () =>
        new Promise(
          async (resolve) =>
            await sendSubscriptionEmail({
              path: "dashboard/settings",
              to: userMail,
              mailType: "welcome",
              unsubscribeToken: unsubscribeToken,
            }).then(resolve),
        );

      toast.promise(promise, {
        loading: "Sending welcome email...",
        success: () => {
          return `You have a welcome email sent to ${userMail}`;
        },
        error: () => {
          return "Failed to send welcome email";
        },
      });
    }
  };

  if (!id) {
    return (
      <>
        <ConfirmedSusbcriptionCTA
          data={{
            titleCta: "Subscription token is missing",
            title: "Newsletter Subscription",
            descriptionStart: "We did not receive a valid token for",
            strongTxt: "SEO.eBook newsletter subscription.",
            descriptionEnd:
              "Please try again later or contact us for further assistance.",
          }}
        />
        <NewsletterLandingPreview />
      </>
    );
  }

  return (
    <>
      {subscribed === "CONFIRMED" ? (
        <>
          <ConfirmedSusbcriptionCTA
            data={{
              titleCta: "Your newsletter subscription is confirmed !",
              title: "Subscription Confirmed",
              descriptionStart: "We are happy to have you on board. Enjoy",
              strongTxt: "news, updates, tips, and tricks",
              descriptionEnd:
                "from SEO.eBook website. We've sent a welcome email to your inbox.",
            }}
          />
          <NewsletterLandingPreview />
        </>
      ) : (
        <>
          <ConfirmedSusbcriptionCTA
            data={{
              titleCta: `${message}...`,
              title: "Newsletter Subscription",
              descriptionStart: !loading
                ? "We did not receive a valid token for"
                : "",
              strongTxt: !loading ? "SEO.eBook newsletter subscription." : "",
              descriptionEnd: !loading
                ? "Please try again later or contact us for further assistance."
                : "",
            }}
          />
          <NewsletterLandingPreview />
        </>
      )}
    </>
  );
}
