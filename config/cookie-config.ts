import CookieConsent, { Cookies } from "react-cookie-consent";

import { env } from "@/env.mjs";
import { trackingConfig } from "@/config/tracking";

const getConfig = () => {
  const config: CookieConsentConfig = {
    // Default configuration for the modal.
    root: "body",
    autoShow: true,
    disablePageInteraction: false,
    hideFromBots: process.env.PROD ? true : false, // Set this to false for dev/headless tests otherwise the modal will not be visible.
    mode: "opt-in",
    revision: 0,

    // Default configuration for the cookie.
    cookie: {
      name: trackingConfig.cookieBannerCookieName,
      domain: "",
      path: "/",
      sameSite: "Lax",
      expiresAfterDays: trackingConfig.expires,
      secure: process.env.NODE_ENV === "production" ? true : false,
    },

    // NOT IMPLEMENTED: Default configuration for the preferences modal.
    guiOptions: {
      consentModal: {
        layout: "box",
        position: "bottom right",
        equalWeightButtons: true,
        flipButtons: false,
      },
    },

    handleCookies: {
      onAccept: (cookies, categories) => {
        categories.forEach((category) => {
          switch (category) {
            case "functional":
              try {
                cookies.forEach((cookie) => {
                  Cookies.set(cookie, JSON.stringify({}), {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                    sameSite: "Lax",
                    secure: process.env.NODE_ENV === "production",
                    path: "/",
                    domain: env.NEXT_PUBLIC_APP_URL,
                  });
                });
              } catch (error) {
                console.error(error);
              }
          }
        });
      },
      onReject: (cookies, categories) => {
        categories.forEach((category) => {
          switch (category) {
            case "functional":
              try {
                cookies.forEach((cookie) => {
                  Cookies.remove(cookie);
                });
              } catch (error) {
                console.error(error);
              }
          }
        });
      },
      onUpdate: (cookies, categories) => {
        console.log("Cookies updated", cookies, categories);
      },
    },

    categories: {
      essential: {
        enabled: true, // this category is enabled by default
        readOnly: true, // this category cannot be disabled
        cookies: [
          {
            name: trackingConfig.cookieBannerCookieName,
            description:
              "Stores the cookie consent state and cookies preferences of the user.",
          },
        ],
        services: {
          //   essential: {
          //     label: "Essential Cookies",
          //     onAccept: () => {},
          //     onReject: () => {},
          //   },
        },
      },

      functional: {
        enabled: false,
        readOnly: false,
        cookies: [
          {
            name: "functional",
            description:
              "Stores user preferences to enhance the user experience.",
          },
        ],

        services: {
          subscription: {
            label: "Newsletter Subscription",
            cookieName: "sb_newsletter",
            description:
              "Remembers if the user has subscribed to the newsletter. And if so, when the subscription expires.",
            onAccept: () => {
              try {
                const consent = Cookies.get(getConfig().cookie.name);
                const { categories, expiresDate } = consent
                  ? JSON.parse(consent)
                  : { categories: [], expiresDate: new Date(0) };
                if (
                  categories.includes("functional") &&
                  new Date(expiresDate) > new Date(Date.now())
                ) {
                  Cookies.set(
                    "sb_newsletter",
                    JSON.stringify({
                      subscribed: true,
                      expiresDate: new Date(
                        Date.now() + 1000 * 60 * 60 * 24 * 365,
                      ),
                    }),
                    {
                      path: "/",
                      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                    },
                  );
                }
              } catch (error) {
                console.error(error);
              }
            },
            onReject: () => {
              try {
                Cookies.remove("sb_newsletter");
              } catch (error) {
                console.error(error);
              }
            },
          },

          // darkMode: {
          //   label: "Dark Mode",
          //   onAccept: () => {
          //     try {
          //       // Add your dark mode logic here.
          //     } catch (error) {
          //       console.error(error);
          //     }
          //   },
          //   onReject: () => {
          //     try {
          //       // Add your dark mode logic here.
          //     } catch (error) {
          //       console.error(error);
          //     }
          //   },
          // },
        },
      },

      analytics: {
        enabled: false,
        readOnly: false,
        autoClear: {
          cookies: [
            {
              name: /^_ga/, // regex: match all cookies starting with '_ga'
              description: "Google Analytics cookie",
            },
            {
              name: "_gid", // string: exact cookie name
              description: "Google Analytics cookie",
            },
          ],
        },

        services: {
          //   ga: {
          //     label: "Google Analytics",
          //     onAccept: () => {
          //       try {
          //         const GA_ANALYTICS_ID =
          //           process.env.REACT_APP_GOOGLE_ANALYTICS_ID;
          //         if (!GA_ANALYTICS_ID?.length) {
          //           throw new Error("Google Analytics ID is missing");
          //         }
          //         window.dataLayer = window.dataLayer || [];
          //         const gtag = (..._args: unknown[]) => {
          //           (window.dataLayer as Array<any>).push(_args);
          //         };
          //         gtag("js", new Date());
          //         gtag("config", GA_ANALYTICS_ID);
          //         // Adding the script tag dynamically to the DOM.
          //         const script = document.createElement("script");
          //         script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ANALYTICS_ID}`;
          //         script.async = true;
          //         document.body.appendChild(script);
          //       } catch (error) {
          //         console.error(error);
          //       }
          //     },
          //     onReject: () => {},
          //   },
        },
      },

      marketing: {
        enabled: false,
        readOnly: false,
        autoClear: {
          cookies: [
            {
              name: /^_fbp/, // regex: match all cookies starting with '_fbp'
              description: "Facebook Pixel cookie",
            },
          ],
        },

        services: {
          //   facebook: {
          //     label: "Facebook Pixel",
          //     onAccept: () => {
          //       try {
          //         // Adding the script tag dynamically to the DOM.
          //         const script = document.createElement("script");
          //         script.src = "https://connect.facebook.net/en_US/fbevents.js";
          //         script.async = true;
          //         document.body.appendChild(script);
          //       } catch (error) {
          //         console.error(error);
          //       }
          //     },
          //     onReject: () => {},
          //   },
        },
      },
    },

    language: {
      default: "en",
      translations: {
        en: {
          consentModal: {
            title: "We use cookies",
            description:
              "We use cookies primarily for analytics to enhance your experience. By accepting, you agree to our use of these cookies. You can manage your preferences or learn more about our cookies policy.",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject all",
            showPreferencesBtn: "Manage Individual preferences", // (OPTIONAL) Activates the preferences modal
            policies: {
              privacy: "Read more about our privacy policy",
              terms: "Terms and Conditions",
              cookies: "Cookies Policy",
            },
            // TODO: Add your own privacy policy and terms and conditions links below.
            footer: `
            <a href="<your-url-here>" target="_blank">Privacy Policy</a>
            <a href="<your-url-here>" target="_blank">Terms and Conditions</a>
                    `,
          },
          // The showPreferencesBtn activates this modal to manage individual preferences for cookies.
          preferencesModal: {
            sections: [
              {
                title: "Essential Cookies",
                services: {
                  id: "essential",
                  description:
                    "Necessary for website functionality, including secure login, website security, performance optimization and payment processing.",
                },
              },
              {
                title: "Functional Cookies",
                services: {
                  id: "functional",
                  description:
                    "Stores user preferences to enhance the user experience. For example language and currency preferences.",
                },
              },
              {
                title: "Analytical Cookies",
                services: {
                  id: "analytics",
                  description:
                    "Help us understand how visitors use our site through tools like Google Analytics. All data collected is anonymized.",
                },
              },
              {
                title: "Marketing Cookies",
                services: {
                  id: "marketing",
                  description:
                    "Track user behavior and display personalized ads based on your interests. We do not sell your data to third parties.",
                },
              },
            ],
          },
        },
      },
    },
  };

  return config;
};

export default getConfig;
