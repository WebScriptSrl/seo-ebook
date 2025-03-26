import { allPosts } from "contentlayer/generated";
import { Blog, WithContext } from "schema-dts";

import { constructMetadata, getBlurDataURL } from "@/lib/utils";
import { BlogPosts } from "@/components/content/blog-posts";

export const metadata = constructMetadata({
  title: "Blog – Mastering Local SEO",
  description: "Learn how to master local SEO and grow your business.",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export default async function BlogPage() {
  const posts = await Promise.all(
    allPosts
      .filter((post) => post.published)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(async (post) => ({
        ...post,
        blurDataURL: await getBlurDataURL(post.image),
      })),
  );

  const jsonLd: WithContext<Blog> = {
    "@context": "https://schema.org",
    "@type": "Blog",
    url: baseUrl + "/blog",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": baseUrl + "/blog",
    },
    name: "Mastering Local SEO Blog",
    description: "Learn how to master local SEO and grow your business.",
    publisher: {
      "@type": "Organization",
      name: "SEO.eBook",
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      image: `${baseUrl}${post.image}`,
      datePublished: post.date,
      dateModified: post.updated,
      author: post.authors.map((author) => ({
        "@type": "Person",
        name: author,
      })),
      publisher: {
        "@type": "Organization",
        name: "SEO.eBook",
      },
      description: post.description,
      url: baseUrl + post.slug,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPosts posts={posts} />
    </>
  );
}
