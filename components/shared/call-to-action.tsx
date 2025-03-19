import Link from "next/link";

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
  };
}

export default async function CallToAction({ data }: CallToActionProps) {
  return (
    <section className="space-y-2 pb-7 sm:py-5 lg:py-10">
      <div className="container flex max-w-5xl flex-col items-center gap-8 text-center">
        <h2 className="text-balance font-urban text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-[56px]">
          {data.titleCta}{" "}
          <span className="text-gradient_cyan-red font-extrabold">
            {data.title}
          </span>
        </h2>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          {data.descriptionStart} <strong>{data.strongTxt}</strong>{" "}
          {data.descriptionEnd}
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
            <span>{data.titleCta}</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            href={siteConfig.links.amzKindle}
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
              <span className="hidden sm:inline-block">Buy on -</span>{" "}
              <span className="font-bold">Amazon</span>{" "}
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
          <span className="mr-3">🌐</span>
          <span className="hidden md:flex">Stay updated with&nbsp;</span> SEO
          EBook on <Icons.twitter className="ml-2 size-3.5" />
        </Link>
      </div>
    </section>
  );
}
