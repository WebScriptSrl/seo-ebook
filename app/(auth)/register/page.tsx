import { Suspense } from "react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { Icons } from "@/components/shared/icons";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        <>
          Login
          <Icons.chevronRight className="ml-2 size-4" />
        </>
      </Link>
      <div className="hidden h-full bg-muted lg:flex lg:flex-col lg:items-center lg:justify-center lg:space-y-6">
        <Icons.logo className="size-1/5" />
        <Link href="/" className="flex items-center space-x-1.5">
          <span className="text-gradient_cyan-red font-urban text-4xl font-bold">
            {siteConfig.name}
          </span>
        </Link>
        <p className="max-w-md px-8 text-center text-muted-foreground">
          Mastering Local SEO - Unlock the Secrets to Attract Local Customers
          Online
        </p>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto size-8" />
            <h1 className="text-gradient_cyan-red text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <Suspense>
            <UserAuthForm type="register" />
          </Suspense>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
