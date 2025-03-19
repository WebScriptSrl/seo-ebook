"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";

import { buttonVariants } from "../ui/button";
import { Icons } from "./icons";

export function ReviewCTA() {
  const { data: session, status } = useSession();
  return (
    <div className="mb-24 flex flex-col items-center justify-center text-balance text-center">
      <p className="font-xl mb-2" aria-hidden="true">
        Bought a <strong>Local SEO book</strong> from us?{" "}
      </p>
      <span className="mb-4 text-sm text-muted-foreground">
        {`${session ? "Share" : "Sign in to share"} your feedback.`}{" "}
      </span>
      <Link
        href={session ? "/dashboard" : "/login"}
        prefetch={true}
        className={cn(
          buttonVariants({ size: "default", rounded: "full" }),
          "gap-2",
        )}
      >
        <span>Leave a review </span>
        <Icons.arrowRight className="size-4" />
      </Link>
    </div>
  );
}
