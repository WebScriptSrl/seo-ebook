import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "SEO.eBook",
  description:
    "Master Local SEO - A Comprehensive Guide to Dominating Your Local Market: Unlock the Secrets to Attract Local Customers Online",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://x.com/local_seo_game",
    linkedin: "https://www.linkedin.com/in/calin-szekely/",
    webscript: "https://webscript.ro/en",
    amzKindle:
      "https://www.amazon.com/Mastering-Local-SEO-Comprehensive-Dominating-ebook/dp/B0DCGGZX26/ref=tmm_kin_swatch_0?_encoding=UTF8&qid=&sr=",
    amzPaperback:
      "https://www.amazon.com/Mastering-Local-SEO-Comprehensive-Dominating/dp/B0DLT3F3VR/ref=tmm_pap_swatch_0?_encoding=UTF8&qid=&sr=",
    amzHardcover:
      "https://www.amazon.com/Mastering-Local-SEO-Comprehensive-Dominating/dp/B0DLQN6BM4/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=&sr=",
  },
  mailSupport: "hello@seolocal.markets",

  // Settings UI
  modalSignIn: false, // Show only Google Sign In Modal on large screens
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Website",
    items: [
      { title: "Home", href: "/" },
      { title: "Pricing", href: "/pricing" },
      { title: "Blog", href: "/blog" },
      { title: "Guides", href: "/guides" },
      { title: "Sitemap", href: "/sitemap.xml" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Docs", href: "/docs" },
      { title: "Author", href: "/docs/author" },
      { title: "Preface", href: "/docs/book/preface" },
      { title: "Content", href: "/docs/book/content" },
      { title: "Seo Tools", href: "/docs/book/seo-tools" },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Terms & Conditions", href: "/terms" },
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Cookies Policy", href: "/cookies" },
      { title: "ODR Platform", href: "https://ec.europa.eu/consumers/odr" },
    ],
  },
];
