"use client";

import * as React from "react";
import { useContext } from "react";
import Link from "next/link";

import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { ConsentContext } from "@/components/modals/consent-provider";
import { Icons } from "@/components/shared/icons";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const { setShowCookiesPreferencesModal } = useContext(ConsentContext);

  return (
    <footer className={cn("border-t", className)}>
      <div className="container grid max-w-6xl grid-cols-2 gap-6 py-14 md:grid-cols-5">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <span className="text-sm font-medium text-foreground">
              {section.title}
            </span>
            <ul className="mt-4 list-inside space-y-3">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    target={link.href.includes("https") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-full flex flex-col items-end sm:col-span-1 md:col-span-2">
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t py-4">
        <div className="container flex max-w-6xl flex-col-reverse items-center justify-between gap-2 md:flex-row">
          <span className="text-sm text-muted-foreground">
            Copyright &copy; {new Date().getFullYear()}. All rights reserved.
          </span>
          <p className="text-left text-sm text-muted-foreground">
            Powered by{" "}
            <Link
              href={siteConfig.links.webscript}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
              aria-label="WebScript website"
            >
              WebScript
            </Link>{" "}
            for{" "}
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              SEO.eBook
            </Link>
          </p>

          <div className="flex items-center gap-3 self-end">
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
              aria-label="SEO.eBook Twitter account"
            >
              <Icons.twitter className="size-5" />
            </Link>
            <ModeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowCookiesPreferencesModal(true);
              }}
              className="size-8 px-0"
              aria-label="Manage cookies preferences"
            >
              <Icons.settings className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
