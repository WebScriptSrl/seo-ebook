"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
} from "react";
import { Cookies, getCookieConsentValue } from "react-cookie-consent";

import getConfig from "@/config/cookie-config";
import { grantConsentForEverything } from "@/lib/tracking";
import { useCookieBanner } from "@/components/modals/cookie-banner";
import { useCookiesPreferencesModal } from "@/components/modals/cookies-preferences";

export const ConsentContext = createContext<{
  setShowCookiesPreferencesModal: Dispatch<SetStateAction<boolean>>;
  setShowCookiesBanner: Dispatch<SetStateAction<boolean>>;
}>({
  setShowCookiesPreferencesModal: () => {},
  setShowCookiesBanner: () => {},
});

export default function ConsentProvider({ children }: { children: ReactNode }) {
  const { CookiesPreferencesModal, setShowCookiesPreferencesModal } =
    useCookiesPreferencesModal();

  const { CookiesBanner, setShowCookiesBanner } = useCookieBanner();

  const { cookie } = getConfig();

  useEffect(() => {
    const hasConsent = Cookies.get(cookie.name);

    if (hasConsent === undefined) {
      setShowCookiesBanner(true);
    } else {
      const valueObj = JSON.parse(hasConsent);

      if (new Date(valueObj.expiresDate) < new Date(Date.now())) {
        Cookies.remove(cookie.name);
        setShowCookiesBanner(true);
        return;
      } else {
        setShowCookiesBanner(false);
      }
    }
  }, [setShowCookiesBanner, cookie.name]);

  return (
    <ConsentContext.Provider
      value={{
        setShowCookiesPreferencesModal,
        setShowCookiesBanner,
      }}
    >
      <CookiesBanner />
      <CookiesPreferencesModal />
      {children}
    </ConsentContext.Provider>
  );
}
