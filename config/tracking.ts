import { env } from "@/env.mjs";

export const IS_GTM_ENABLED =
  env.NEXT_PUBLIC_GTM_ID !== undefined && env.NEXT_PUBLIC_GTM_ID !== "";

export const trackingConfig = {
  gtmId: env.NEXT_PUBLIC_GTM_ID || "",
  cookieBannerCookieName: "sb_cookie",
  expires: 365,
};
