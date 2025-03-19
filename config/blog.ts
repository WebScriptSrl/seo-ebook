export const BLOG_CATEGORIES: {
  title: string;
  slug: "news" | "education";
  description: string;
}[] = [
  {
    title: "News",
    slug: "news",
    description: "Updates and news from the SEO world.",
  },
  {
    title: "Education",
    slug: "education",
    description: "Educational content to help you grow your business.",
  },
];

export const BLOG_AUTHORS = {
  calin: {
    name: "Calin S.",
    image: "/_static/avatars/calin-avatar.jpg",
    twitter: "calyn_s",
  },
  webscript: {
    name: "WebScript",
    image: "/_static/avatars/web-script-logo-twitter.png",
    twitter: "_web_script_",
  },
};
