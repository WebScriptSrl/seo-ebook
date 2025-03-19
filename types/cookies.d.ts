type CookieConsentConfig = {
  root: string;
  autoShow: boolean;
  disablePageInteraction: boolean;
  hideFromBots: boolean;
  mode: "opt-in" | "opt-out";
  revision: number;

  cookie: {
    name: string;
    domain: string;
    path: string;
    sameSite: "Strict" | "Lax" | "None";
    expiresAfterDays: number;
    secure?: boolean;
  };

  guiOptions: {
    consentModal: {
      layout: "box" | "bar";
      position:
        | "top"
        | "bottom"
        | "top left"
        | "top right"
        | "bottom left"
        | "bottom right";
      equalWeightButtons: boolean;
      flipButtons: boolean;
    };
  };

  handleCookies: {
    onAccept: (cookies: string[], categories: string[]) => void;
    onReject: (cookies: string[], categories: string[]) => void;
    onUpdate: (cookies: string[], categories: string[]) => void;
  };

  categories: {
    essential: {
      enabled: boolean;
      readOnly: boolean;
      cookies?: {
        name: string | RegExp;
        description: string;
      }[];

      services: {
        [key: string]: {
          label: string;
          cookieName: string;
          description: string;
          onAccept: () => void;
          onReject: () => void;
        };
      };
    };

    functional: {
      enabled: boolean;
      readOnly: boolean;
      cookies: {
        name: string | RegExp;
        description: string;
      }[];

      services: {
        [key: string]: {
          label: string;
          cookieName: string;
          description: string;
          onAccept: () => void;
          onReject: () => void;
        };
      };
    };

    analytics: {
      enabled: boolean;
      readOnly?: boolean;
      autoClear: {
        cookies: {
          name: RegExp | string;
          description?: string;
        }[];
      };

      services: {
        [key: string]: {
          label: string;
          onAccept: () => void;
          onReject: () => void;
        };
      };
    };

    marketing: {
      enabled: boolean;
      readOnly: boolean;
      autoClear: {
        cookies: {
          name: RegExp | string;
          description?: string;
        }[];
      };

      services: {
        [key: string]: {
          label: string;
          onAccept: () => void;
          onReject: () => void;
        };
      };
    };
  };

  language: {
    default: string;
    translations: {
      [key: string]: {
        consentModal: {
          title: string;
          description: string;
          acceptAllBtn: string;
          acceptNecessaryBtn: string;
          showPreferencesBtn: string;
          policies: {
            privacy: string;
            terms: string;
            cookies: string;
          };
          footer: string;
        };
        preferencesModal: {
          sections: {
            title: string;
            services: {
              [key: string]: string;
            };
          }[];
        };
      };
    };
  };
};

type CookieObj = {
  categories: string[];
  timestamp: number;
  consentId: number;
  date: Date;
  expiresDate: Date;
  consentUpdated?: Date;
};
