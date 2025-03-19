"use client";

import { useState } from "react";
import { toast } from "sonner";

import getConfig from "@/config/cookie-config";
import { Button } from "@/components/ui/button";
import ConfirmedSusbcriptionCTA from "@/components/newsletter/confirmed-subscription-cta";
import NewsletterLandingPreview from "@/components/newsletter/newsletter-landing-preview";

export default function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = searchParams;
  const [unsubscribed, setUnsubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Validating your request");

  const { subscription } = getConfig().categories.functional.services;

  const unsubscribe = async () => {
    const promise = await fetch(`/api/newsletter/unsubscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        getSetCookie: subscription.cookieName,
      },
      body: JSON.stringify({ token }),
    });

    toast.promise(promise.json(), {
      loading: "Unsubscribing...",
      success: (data: any) => {
        if (data.message === "Unsubscribed successfully!") {
          setUnsubscribed(true);
          setMessage(data.message);
          setLoading(false);
          return data.message;
        }

        if (data.message.includes("prisma")) {
          throw new Error("Unsubscribe token is not valid");
        }
      },
      error: (error) => {
        if (error.message.includes("prisma")) {
          setMessage("Unsubscribe token is not valid");
          setLoading(false);
          return "Unsubscribe token is not valid";
        }
        setMessage(error.message);
        setLoading(false);
        return "An error occurred while unsubscribing";
      },
    });
  };

  if (token && unsubscribed === false) {
    return (
      <div className="flex flex-col items-center justify-center">
        <ConfirmedSusbcriptionCTA
          data={{
            titleCta: "Unsubscribing...",
            title: "Newsletter Subscription",
            descriptionStart: "We are processing your request to",
            strongTxt: "unsubscribe from Mastering Local SEO newsletter!",
            descriptionEnd: "Are you sure you want to unsubscribe?",
            disableLinks: true,
          }}
        />

        <Button variant={"destructive"} onClick={unsubscribe} className="mb-10">
          Confirm
        </Button>

        <NewsletterLandingPreview />
      </div>
    );
  }

  return (
    <>
      {!token && (
        <>
          <ConfirmedSusbcriptionCTA
            data={{
              titleCta: "Unsubscribe token is missing",
              title: "Newsletter Subscription",
              descriptionStart: "We did not receive a valid token for",
              strongTxt: "SEO.eBook newsletter ",
              descriptionEnd:
                "unsubscribe request. Please try again later or contact us for further assistance.",
            }}
          />
          <NewsletterLandingPreview />
        </>
      )}
      {token && unsubscribed && (
        <>
          <ConfirmedSusbcriptionCTA
            data={{
              titleCta: "Unsubscribed successfully!",
              title: "Newsletter Subscription",
              descriptionStart: "You have successfully unsubscribed from",
              strongTxt: "Mastering Local SEO newsletter.",
              descriptionEnd:
                "We are sorry to see you go. If you change your mind, you can always resubscribe.",
            }}
          />
        </>
      )}
      {token && !unsubscribed && (
        <>
          <ConfirmedSusbcriptionCTA
            data={{
              titleCta: `${message}...`,
              title: "Newsletter Subscription",
              descriptionStart: !loading
                ? "We did not receive a valid token for"
                : "",
              strongTxt: !loading ? "SEO.eBook Newsletter " : "",
              descriptionEnd: !loading
                ? "unsubscribe request. Please try again later or contact us for further assistance."
                : "",
            }}
          />
          <NewsletterLandingPreview />
        </>
      )}
    </>
  );
}
