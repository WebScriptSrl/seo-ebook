import { Gtag, GtagEvent } from "@/types";

import { IS_GTM_ENABLED, trackingConfig } from "@/config/tracking";

const logGAWarning = (message: string) => {
  console.warn(`[Tracking] Warning: ${message}`);
};

const getGtag = () => {
  if (!IS_GTM_ENABLED) {
    logGAWarning("Google Tag Manager is not enabled.");
    return null;
  }

  if (!window.gtag) {
    logGAWarning("GTag is not loaded.");
    throw new Error("GTag is not loaded.");
  }

  return window.gtag;
};

const withGtag = (callback: (gtag: Gtag.Gtag) => void) => {
  const gtag = getGtag();

  if (!gtag) {
    return;
  }

  callback(gtag);
};

export const sendGAEvent = (event: GtagEvent) => {
  withGtag((gtag) => {
    gtag("event", event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  });
};

export const grantConsentForEverything = () => {
  withGtag((gtag) => {
    gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
  });
};

export const grantConsentForNecessary = () => {
  withGtag((gtag) => {
    gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  });
};

export const grantConsentForSelected = (consent: string[]) => {
  withGtag((gtag) => {
    gtag("consent", "update", {
      ad_storage: consent.includes("marketing") ? "granted" : "denied",
      ad_user_data: consent.includes("marketing") ? "granted" : "denied",
      ad_personalization: consent.includes("marketing") ? "granted" : "denied",
      analytics_storage: consent.includes("analytics") ? "granted" : "denied",
    });
  });
};

export const markFeatureUsage = (feature: string) => {
  performance.mark("mark_feature_usage", {
    detail: { feature },
  });
};

export const pageView = (url: string) => {
  withGtag((gtag) => {
    gtag("config", trackingConfig.gtmId, {
      page_path: url,
    });
  });
};
