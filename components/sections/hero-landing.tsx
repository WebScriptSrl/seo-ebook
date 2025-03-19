import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default async function HeroLanding() {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-8 text-center">
        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Start dominating your local markets with{" "}
          <span className="text-gradient_cyan-red font-extrabold">
            Mastering Local SEO
          </span>
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Unlock the secrets to attract local customers online with our{" "}
          <span className="font-bold">Mastering Local SEO</span> Book. Learn how
          to optimize your online presence for local search and dominate your
          local markets.
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/pricing"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2",
            )}
          >
            <span className="hidden sm:inline-block">Go</span>
            <span>Pricing</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            href={siteConfig.links.webscript}
            target="_blank"
            rel="noreferrer"
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
              <span className="hidden sm:inline-block">Book launch -</span>{" "}
              <span className="font-bold">WebScript{""}</span>
            </p>
            <Icons.arrowRight className="size-4" />
          </Link>
        </div>

        <Link
          href={siteConfig.links.twitter}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4",
          )}
          target="_blank"
        >
          <span className="mr-3">🎉</span>
          <span className="hidden md:flex">Stay updated with&nbsp;</span> SEO
          EBook on <Icons.twitter className="ml-2 size-3.5" />
        </Link>
      </div>
    </section>
  );
}
