import { ReviewState, User } from "@prisma/client";
import type { Icon } from "lucide-react";

import { Icons } from "@/components/shared/icons";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    webscript: string;
    github?: string;
    linkedin: string;
    amzKindle: string;
    amzPaperback: string;
    amzHardcover: string;
  };
  modalSignIn: boolean;
};

export type NavItem = {
  title: string;
  href: string;
  badge?: string;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type MainNavItem = NavItem;

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type SidebarNavItem = {
  title: string;
  items: NavItem[];
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

// subcriptions
export type SubscriptionPlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
  };
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
  };

// product orders

export type ProductOrder = {
  title: string;
  key: string;
  promoCode?: string;
  description: string;
  benefits: string[];
  limitations: string[];
  type: "download" | "amazon";
  image?: string;
  price: {
    full: number;
    discount?: number;
  };

  stripeId?: string;
  amzUrl: Url | null;
};

export type AmazonProduct = Omit<ProductOrder, "stripeId", "key"> & {
  amzUrl?: string;
};

export type UserProductOrder = ProductOrder &
  AmazonProduct & {
    id: string;
    stripeCustomerId: string | null;
    stripePriceId: string | null;
    isPaid: boolean;
    type: "download" | "amazon";
    productTypeAmz?: "kindle" | "paperback" | "hardcover";
    productTypeDirect?: "pdf" | "epub" | "print";
    createdAt: number | null;
    updatedAt: number | null;
  };

// compare plans and products
export type ColumnType = string | boolean | null;
export type PlansRow = { feature: string; tooltip?: string } & {
  [key in (typeof plansColumns)[number]]: ColumnType;
};
export type ProductsRow = { feature: string } & {
  [key in (typeof productColumns)[number]]: ColumnType;
};

// landing sections
export type InfoList = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

export type InfoLdg = {
  title: string;
  image: string;
  description: string;
  list: InfoList[];
};

export type FeatureLdg = {
  title: string;
  description: string;
  link: string;
  showLink?: boolean;
  btnText?: string;
  icon: keyof typeof Icons;
};

export type TestimonialType = {
  name: string;
  job: string;
  location: string;
  image?: string;
  product?: string;
  review: string;
  rating: number;
};

export type UserReview = {
  id: string;
  name: string;
  job: string;
  location: string;
  image?: string;
  product?: Product;
  review: string;
  rating: number;
  productName?: string;
  approved?: ReviewState;
  createdAt: Date;
  updatedAt: Date;
};

export type Product =
  | "PDF eBook"
  | "ePub eBook"
  | "Print Ready"
  | "Kindle eBook"
  | "Paperback"
  | "Hardcover";

// types for analytics
declare global {
  interface Window {
    gtag?: Gtag.Gtag;
  }
}

declare namespace Gtag {
  interface Gtag {
    (...args: GtagFunctionArgs): void;
  }

  type GtagFunctionArgs =
    | [GtagCommand, EventName | EventParams | CustomParams]
    | [GtagCommand, string, EventParams | CustomParams];

  type GtagCommand = "config" | "set" | "event" | "js" | "consent";

  interface EventParams {
    [key: string]: unknown;
  }

  interface CustomParams {
    [key: string]: unknown;
  }

  type EventName =
    | "click"
    | "submit"
    | "purchase"
    | "page_view"
    | "screen_view";

  type SendGAEventDto = {
    action: EventName;
    category: string;
    label?: string;
  };
}

type GtagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

type ResendEvent =
  | "email.sent"
  | "email.delivered"
  | "email.delivery_delayed"
  | "email.complained"
  | "email.bounced"
  | "email.opened"
  | "email.clicked";

interface WebhookEvent {
  created_at: Date;
  data: {
    created_at: Date;
    email_id: string;
    from: string;
    subject: string;
    to: string[];
  };
  type: ResendEvent;
}
