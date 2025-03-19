import { DocsConfig } from "types";

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Docs",
      href: "/docs",
    },
    {
      title: "Guides",
      href: "/guides",
    },
  ],
  sidebarNav: [
    {
      title: "About",
      items: [
        {
          title: "Intro",
          href: "/docs",
        },
        {
          title: "Author",
          href: "/docs/author",
        },
      ],
    },
    {
      title: "The SEO Book",
      items: [
        {
          title: "Preface",
          href: "/docs/book/preface",
        },
        {
          title: "Expectations",
          href: "/docs/book/expectations",
        },
        {
          title: "Content",
          href: "/docs/book/content",
        },
        {
          title: "SEO Tools",
          href: "/docs/book/seo-tools",
        },
        {
          title: "Next Steps",
          href: "/docs/book/next-steps",
        },
        {
          title: "Conclusion",
          href: "/docs/book/conclusion",
        },
      ],
    },
  ],
};
