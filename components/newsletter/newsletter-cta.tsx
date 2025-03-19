"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import getConfig from "@/config/cookie-config";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface CallToActionProps {
  data: {
    titleCta: string;
    title: string;
    descriptionStart: string;
    descriptionEnd: string;
    strongTxt: string;
    btnText: string;
    url: string;
    token?: string;
    isValid: boolean;
  };
}

export default function NewsletterCTA({ data }: CallToActionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(data.isValid);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (data.token) {
      setValidToken(true);
    }
  }, [data.token]);

  // Get the cookie configuration
  const { cookie } = getConfig();
  const { subscription } = getConfig().categories.functional.services;

  const handleSubscribe = async () => {
    setLoading(true);
    const response = await fetch("/api/newsletter/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        getSetCookie: cookie.name,
        append: subscription.cookieName,
      },
      body: JSON.stringify({ token: data.token }),
    });

    toast.promise(response.json(), {
      loading: "Confirming your subscription...",
      success: (res: {
        status: number;
        message: string;
        data: { id: string };
      }) => {
        if (res.status === 201) {
          setTimeout(() => {
            router.push(`${data.url}?id=${res.data.id}`);
          }, 2000);
          return res.message;
        }
        throw new Error(res.message);
      },
      error: (error) => {
        setLoading(false);
        setValidToken(false);
        setErrorMessage(error.message);
        return error.message;
      },
    });
  };

  return (
    <section className="space-y-2 pb-7 sm:py-5 lg:py-10">
      <div className="container flex max-w-5xl flex-col items-center gap-8 pt-10 text-center">
        <h2 className="text-gradient_cyan-red text-balance font-urban text-3xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          {data.title}
        </h2>

        <h3 className="text-balance font-urban text-2xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-[46px]">
          {validToken ? data.titleCta : errorMessage}
        </h3>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          {validToken ? data.descriptionStart : ""}{" "}
          <strong>
            {validToken
              ? data.strongTxt
              : `Something went wrong: ${errorMessage}!`}
          </strong>{" "}
          {validToken ? data.descriptionEnd : "Please try again later."}
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          {!validToken && (
            <>
              <Link
                href={data.url}
                prefetch={true}
                className={cn(
                  buttonVariants({ size: "lg", rounded: "full" }),
                  "gap-2",
                )}
              >
                <span>Home</span>
                <Icons.arrowRight className="size-4" />
              </Link>

              <Link
                href={"/login"}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                    rounded: "full",
                  }),
                  "px-5",
                )}
              >
                <Icons.logo className="mr-2 size-4" />
                <p>
                  <span className="font-bold">Sign In</span>{" "}
                </p>
                <Icons.arrowRight className="ml-2 size-4" />
              </Link>
            </>
          )}

          {validToken && (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className={cn(
                buttonVariants({ size: "lg", rounded: "full" }),
                "gap-2",
              )}
            >
              <span>{data.btnText}</span>
              {loading ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                <Icons.arrowRight className="size-4" />
              )}
            </button>
          )}
        </div>

        {!validToken && (
          <Link
            href={siteConfig.links.twitter}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
                rounded: "full",
              }),
              "px-4",
            )}
            target="_blank"
          >
            <span className="mr-3">🌐</span>
            <span className="hidden md:flex">Stay updated with&nbsp;</span> SEO
            EBook on <Icons.twitter className="ml-2 size-3.5" />
          </Link>
        )}
      </div>
    </section>
  );
}
