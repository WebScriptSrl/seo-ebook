"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import CookieConsent, { Cookies } from "react-cookie-consent";

import getConfig from "@/config/cookie-config";
import { trackingConfig } from "@/config/tracking";
import {
  grantConsentForEverything,
  grantConsentForNecessary,
} from "@/lib/tracking";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ConsentContext } from "@/components/modals/consent-provider";
import { Icons } from "@/components/shared/icons";

function CookieConsentBanner({
  showCookiesBanner,
  setShowCookiesBanner,
}: {
  showCookiesBanner: boolean;
  setShowCookiesBanner: Dispatch<SetStateAction<boolean>>;
}) {
  const { setShowCookiesPreferencesModal } = useContext(ConsentContext);
  const { consentModal, preferencesModal } =
    getConfig().language.translations.en;

  const { categories, disablePageInteraction, cookie } = getConfig();

  const handleAcceptAll = () => {
    const consentValues = Object.keys(categories);
    const cookiesObj: CookieObj = {
      categories: consentValues,
      timestamp: Date.now(),
      date: new Date(Date.now()),
      consentId: crypto.getRandomValues(new Uint32Array(1))[0],
      expiresDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };

    Cookies.set(
      trackingConfig.cookieBannerCookieName,
      `${JSON.stringify(cookiesObj)}`,
      {
        expires: 365,
        sameSite: cookie.sameSite,
        path: cookie.path,
        domain: cookie.domain,
        secure: cookie.secure,
      },
    );

    setShowCookiesBanner(false);
    grantConsentForEverything();
  };

  const handleDeclineAll = () => {
    const cookiesObj: CookieObj = {
      categories: ["essential"],
      timestamp: Date.now(),
      date: new Date(Date.now()),
      consentId: crypto.getRandomValues(new Uint32Array(1))[0],
      expiresDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };

    Cookies.set(
      trackingConfig.cookieBannerCookieName,
      `${JSON.stringify(cookiesObj)}`,
      {
        expires: 365,
        sameSite: cookie.sameSite,
        path: cookie.path,
        domain: cookie.domain,
        secure: cookie.secure,
      },
    );
    grantConsentForNecessary();
    setShowCookiesBanner(false);
  };

  return (
    <>
      {showCookiesBanner && (
        <div className="fixed inset-x-0 z-30 flex md:justify-end">
          <CookieConsent
            // debug={process.env.NODE_ENV === "development"}
            cookieSecurity
            disableButtonStyles
            disableStyles
            overlay={disablePageInteraction}
            contentClasses="text-sm"
            buttonWrapperClasses="relative flex flex-col-reverse gap-3 justify-center mt-5 mb-4 md:border-l md:pl-5 md:border-primary/50"
            containerClasses="z-30 flex flex-col bg-secondary text-secondary-foreground shadow-inner p-4 fixed bottom-0 h-auto rounded-t-2xl md:max-w-[calc(100%-10rem)] md:flex-row md:gap-5 lg:max-w-[calc(100%-23rem)] lg:max-w-[900px] 2xl:left-[calc(55%-30rem)] 2xl:max-w-[calc(10%+55rem)]"
            buttonClasses={cn(
              buttonVariants({
                variant: "default",
                size: "default",
                rounded: "lg",
              }),
              "text-nowrap md:px-8 lg:px-12",
            )}
            declineButtonClasses={cn(
              buttonVariants({
                variant: "default",
                size: "default",
                rounded: "lg",
              }),
              "text-nowrap md:px-8 lg:px-12",
            )}
            cookieName={trackingConfig.cookieBannerCookieName}
            location="bottom"
            buttonText={consentModal.acceptAllBtn}
            declineButtonText={consentModal.acceptNecessaryBtn}
            enableDeclineButton
            overlayClasses="fixed inset-0 bg-black/50 z-40"
            onAccept={handleAcceptAll}
            onDecline={handleDeclineAll}
          >
            <h3 className="mb-2 text-lg font-semibold">
              We use cookies !!! 🍪
            </h3>
            <p className="text-sm">{consentModal.description}</p>

            <Separator className="mt-4 bg-primary/50" />

            <div
              className={cn(
                "mt-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-3",
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Link
                  href="/cookies"
                  className={cn(
                    buttonVariants({
                      variant: "link",
                      size: "sm",
                      rounded: "default",
                    }),
                    "text-xs",
                  )}
                >
                  Cookies Policy
                </Link>
                <Link
                  href="/privacy"
                  className={cn(
                    buttonVariants({
                      variant: "link",
                      size: "sm",
                      rounded: "default",
                    }),
                    "text-xs",
                  )}
                >
                  Privacy Policy
                </Link>
              </div>
              {preferencesModal.sections.length > 0 && (
                <Button
                  rounded="lg"
                  size="sm"
                  onClick={() => {
                    setShowCookiesPreferencesModal(true),
                      setShowCookiesBanner(false);
                  }}
                >
                  <Icons.settings className="mr-2 size-4" />
                  Consent Settings
                </Button>
              )}
            </div>
          </CookieConsent>
        </div>
      )}
    </>
  );
}

export function useCookieBanner() {
  const [showCookiesBanner, setShowCookiesBanner] = useState(false);

  const CookiesBannerCallback = useCallback(() => {
    return (
      <CookieConsentBanner
        showCookiesBanner={showCookiesBanner}
        setShowCookiesBanner={setShowCookiesBanner}
      />
    );
  }, [showCookiesBanner, setShowCookiesBanner]);

  return useMemo(
    () => ({
      setShowCookiesBanner,
      CookiesBanner: CookiesBannerCallback,
    }),
    [setShowCookiesBanner, CookiesBannerCallback],
  );
}
