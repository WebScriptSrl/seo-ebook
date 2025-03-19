import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { Cookies, getCookieConsentValue } from "react-cookie-consent";

import getConfig from "@/config/cookie-config";
import {
  grantConsentForEverything,
  grantConsentForSelected,
} from "@/lib/tracking";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ConsentContext } from "@/components/modals/consent-provider";
import { Icons } from "@/components/shared/icons";

function CookiesPreferencesModal({
  showCookiesPreferencesModal,
  setShowCookiesPreferencesModal,
}: {
  showCookiesPreferencesModal: boolean;
  setShowCookiesPreferencesModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { setShowCookiesBanner } = useContext(ConsentContext);
  const [cookiesPreferencesClicked, setCookiesPreferencesClicked] =
    useState(false);

  const [hasConsent, setHasConsent] = useState(false);
  const [consentValues, setConsentValues] = useState<string[]>([]);
  const [cookiesPreferences, setCookiesPreferences] = useState<string[]>([]);
  const [cookiesObject, setCookiesObject] = useState<CookieObj | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  const [deselectAll, setDeselectAll] = useState(false);
  const [functionalCookies, setFunctionalCookies] = useState<string[]>([]);

  const { cookie, categories, handleCookies } = getConfig();
  const { sections } = getConfig().language.translations.en.preferencesModal;
  const { functional, marketing, analytics } = categories;
  const functionalServices = Object.keys(categories.functional.services);

  useEffect(() => {
    const hasConsent = getCookieConsentValue(cookie.name);
    const cookies: string[] = [];

    if (hasConsent === undefined) {
      setCookiesPreferences(["essential"]);
      return;
    }
    const valueObj: CookieObj = JSON.parse(hasConsent);

    if (new Date(valueObj.expiresDate) < new Date(Date.now())) {
      Cookies.remove(cookie.name);
      setCookiesPreferences(["essential"]);
      return;
    }

    functionalServices.forEach((service) => {
      const cookie = functional.services[service].cookieName;
      if (functionalCookies.includes(cookie)) {
        return;
      }
      cookies.push(cookie);

      setFunctionalCookies(cookies);
    });

    setHasConsent(true);
    setCookiesObject(valueObj);
    setConsentValues(valueObj.categories);
    setCookiesPreferences(valueObj.categories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasConsent, cookie.name]);

  useEffect(() => {
    if (selectAll) {
      setTimeout(() => {
        setCookiesPreferences(Object.keys(categories));
        setSelectAll(false);
      }, 400);
    }
  }, [selectAll, categories]);

  useEffect(() => {
    if (deselectAll) {
      setTimeout(() => {
        setCookiesPreferences(["essential"]);
        setDeselectAll(false);
      }, 400);
    }
  }, [deselectAll]);

  const handlePreferences = () => {
    const cookiesObj: CookieObj = {
      categories: cookiesPreferences,
      timestamp: Date.now(),
      date: cookiesObject ? cookiesObject.date : new Date(Date.now()), // if user has consent, use the previous date
      consentId: cookiesObject
        ? cookiesObject.consentId
        : crypto.getRandomValues(new Uint32Array(1))[0],
      expiresDate: new Date(
        Date.now() + cookie.expiresAfterDays * 24 * 60 * 60 * 1000,
      ),
      consentUpdated: new Date(Date.now()),
    };

    Cookies.set(cookie.name, `${JSON.stringify(cookiesObj)}`, {
      expires: 365,
      sameSite: cookie.sameSite,
      path: cookie.path,
      domain: cookie.domain,
      secure: cookie.secure,
    });

    if (functionalCookies.length > 0) {
      functionalCookies.forEach((cookie) => {
        const cookieExists = Cookies.get(cookie);

        if (!cookieExists) {
          return;
        }

        if (!cookiesPreferences.includes("functional")) {
          handleCookies.onReject([cookie], ["functional"]);
        }
      });
    }

    if (
      cookiesPreferences.includes("marketing") &&
      cookiesPreferences.includes("analytics")
    ) {
      grantConsentForEverything();
      setCookiesPreferencesClicked(false);
      setShowCookiesPreferencesModal(false);
      return;
    }

    grantConsentForSelected(cookiesPreferences);

    setCookiesPreferencesClicked(false);
    setShowCookiesPreferencesModal(false);
  };

  return (
    <Modal
      type="cookies-settings"
      showModal={showCookiesPreferencesModal}
      setShowModal={setShowCookiesPreferencesModal}
      className="px-5 pt-6"
      onClose={() => {
        setShowCookiesPreferencesModal(false), setShowCookiesBanner(true);
      }}
    >
      <section className="container max-w-4xl py-2">
        <h2 className="mb-1 text-center text-xl font-semibold">
          Cookies Preferences
        </h2>
        <p className="text-center text-sm text-muted-foreground">
          Manage your cookies preferences to enhance your experience.
        </p>
        <Accordion type="single" collapsible className="my-3 w-full">
          {sections.map((item) => (
            <AccordionItem key={item.services.id} value={item.services.id}>
              <div className="flex items-center justify-between">
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <Switch
                  defaultChecked={
                    hasConsent
                      ? consentValues.includes(item.services.id)
                      : undefined
                  }
                  checked={cookiesPreferences.includes(item.services.id)}
                  disabled={categories[item.services.id].readOnly}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setCookiesPreferences((prev) => [
                        ...prev,
                        item.services.id,
                      ]);
                    } else {
                      setCookiesPreferences((prev) =>
                        prev.filter((cat) => cat !== item.services.id),
                      );
                    }
                  }}
                />
              </div>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.services.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="text-xs text-muted-foreground">
          You can change your preferences at any time by the{" "}
          <span>
            <Icons.settings className="inline-block size-4" />
          </span>{" "}
          Settings icon in the footer.
        </p>
      </section>

      <Separator className="mt-2 md:mt-0" />

      <section className="flex flex-col space-y-4 px-8 py-5 md:px-10">
        <div className="my-2 flex justify-evenly gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={
              cookiesPreferencesClicked || cookiesPreferences.length < 2
            }
            onClick={() => {
              setDeselectAll(true);
            }}
          >
            {deselectAll ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.warning className="mr-2 size-4" />
            )}{" "}
            Decline All
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={
              cookiesPreferencesClicked ||
              cookiesPreferences.length === Object.keys(categories).length
            }
            onClick={() => {
              setSelectAll(true);
            }}
          >
            {selectAll ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.page className="mr-2 size-4" />
            )}{" "}
            Select All
          </Button>
        </div>
        <Button
          variant="default"
          disabled={cookiesPreferencesClicked}
          onClick={() => {
            setCookiesPreferencesClicked(true);
            setTimeout(() => {
              handlePreferences();
            }, 400);
          }}
        >
          {cookiesPreferencesClicked ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            <Icons.settings className="mr-2 size-4" />
          )}{" "}
          Save Preferences
        </Button>

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
            onClick={() => {
              setShowCookiesPreferencesModal(false), setShowCookiesBanner(true);
            }}
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
            onClick={() => {
              setShowCookiesPreferencesModal(false), setShowCookiesBanner(true);
            }}
          >
            Privacy Policy
          </Link>
        </div>
      </section>
    </Modal>
  );
}

export function useCookiesPreferencesModal() {
  const [showCookiesPreferencesModal, setShowCookiesPreferencesModal] =
    useState(false);

  const CookiesModalCallback = useCallback(() => {
    return (
      <CookiesPreferencesModal
        showCookiesPreferencesModal={showCookiesPreferencesModal}
        setShowCookiesPreferencesModal={setShowCookiesPreferencesModal}
      />
    );
  }, [showCookiesPreferencesModal, setShowCookiesPreferencesModal]);

  return useMemo(
    () => ({
      setShowCookiesPreferencesModal,
      CookiesPreferencesModal: CookiesModalCallback,
    }),
    [setShowCookiesPreferencesModal, CookiesModalCallback],
  );
}
