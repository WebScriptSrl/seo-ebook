import { MetadataRoute } from "next";
import { allDocs, allGuides, allPages, allPosts } from "contentlayer/generated";

import { BLOG_CATEGORIES } from "@/config/blog";
import { marketingConfig } from "@/config/marketing";

export const generateRoutes = () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const authRoutes = [
    {
      url: `${baseUrl}/login`,
      changefreq: "monthly",
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/register`,
      changefreq: "monthly",
      priority: 0.7,
      lastModified: new Date(),
    },
  ];

  const mainRoutes = marketingConfig.mainNav.map((route) => ({
    url: `${baseUrl}${route.href === "/" ? "" : route.href}`,
    changefreq: "weekly",
    priority: 0.7,
    lastModified: new Date(),
  }));

  mainRoutes.push({
    url: `${baseUrl}/guides`,
    changefreq: "weekly",
    priority: 0.7,
    lastModified: new Date(),
  });

  const blogRoutes = allPosts.map((post) => ({
    url: `${baseUrl}${post.slug}`,
    changefreq: "weekly",
    priority: 0.7,
    lastModified: new Date(post.date),
  }));

  const blogCategoryRoutes = BLOG_CATEGORIES.map((category) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    changefreq: "weekly",
    priority: 0.7,
    lastModified: new Date(),
  }));

  const docRoutes = allDocs.map((doc) => ({
    url: `${baseUrl}${doc.slug}`,
    changefreq: "weekly",
    priority: 0.7,
    lastModified: new Date(),
  }));

  const guideRoutes = allGuides.map((guide) => ({
    url: `${baseUrl}${guide.slug}`,
    changefreq: "weekly",
    priority: 0.7,
    lastModified: new Date(),
  }));

  const pageRoutes = allPages.map((page) => ({
    url: `${baseUrl}/${page.slug.split("/").slice(2).join("/")}`,
    changefreq: "weekly",
    priority: 0.7,
    lastModified: new Date(),
  }));

  const routes = new Set([
    ...authRoutes,
    ...mainRoutes,
    ...blogRoutes,
    ...blogCategoryRoutes,
    ...docRoutes,
    ...guideRoutes,
    ...pageRoutes,
  ]);

  const noDuplicateRoutes = Array.from(routes).reduce(
    (acc: any[], route: any) => {
      const existingRoute = acc.find((r) => r.url === route.url);
      if (!existingRoute) {
        return [...acc, route];
      }
      return acc;
    },
    [],
  );

  return {
    routes: noDuplicateRoutes,
  };
};

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap = generateRoutes();

  return sitemap.routes;
}
