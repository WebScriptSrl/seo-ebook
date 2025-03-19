"use client";

import { Suspense, useEffect, useState } from "react";
import { Cookies } from "react-cookie-consent";

import getConfig from "@/config/cookie-config";
import { trackingConfig } from "@/config/tracking";
import {
  grantConsentForEverything,
  grantConsentForNecessary,
  grantConsentForSelected,
} from "@/lib/tracking";

import { GTMScripts } from "./gtm-scripts";

export const GoogleTagManager = () => {
  const [isGtagLoaded, setIsGtagLoaded] = useState(false);
  const [hasAnalyticsConsent, setAnalyticsConsent] = useState(false);
  const [hasPersonalizationConsent, setPersonalizationConsent] =
    useState(false);
  const [valueObj, setValueObj] = useState<CookieObj | null>(null);
  const [hasSetConsent, setHasSetConsent] = useState(false);

  const { cookie } = getConfig();

  useEffect(() => {
    if (isGtagLoaded && !hasSetConsent) {
      const consent = Cookies.get(cookie.name);

      if (consent === undefined) {
        grantConsentForNecessary();
        setHasSetConsent(false);
        return;
      }

      const valueObj: CookieObj = JSON.parse(consent);
      setValueObj(valueObj);

      if (new Date(valueObj.expiresDate) < new Date(Date.now())) {
        Cookies.remove(cookie.name);
        grantConsentForNecessary();
        setHasSetConsent(false);
        return;
      }

      const { categories } = valueObj;

      if (
        categories.includes("analytics") &&
        categories.includes("marketing")
      ) {
        grantConsentForEverything();
        setHasSetConsent(true);
        return;
      }

      grantConsentForSelected(categories);
      setHasSetConsent(true);
    }
  }, [isGtagLoaded, hasSetConsent, cookie.name]);

  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${trackingConfig.gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>

      <Suspense>
        <GTMScripts
          gaId={trackingConfig.gtmId}
          onLoadCallback={() => setIsGtagLoaded(true)}
        />
      </Suspense>
    </>
  );
};
