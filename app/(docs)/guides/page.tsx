import Link from "next/link";
import { allGuides } from "contentlayer/generated";
import { compareDesc } from "date-fns";

import { cn, formatDate } from "@/lib/utils";
import { DocsPageHeader } from "@/components/docs/page-header";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export const metadata = {
  title: "SEO Guides",
  description:
    "Get the latest SEO guides to help you rank higher in search engines.",
};

export default function GuidesPage() {
  const guides = allGuides
    .filter((guide) => guide.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date));
    });

  return (
    <MaxWidthWrapper className="py-6 lg:py-10">
      <DocsPageHeader
        heading="SEO Guides"
        text="Get the latest SEO guides to help you rank higher in search engines."
      />
      {guides?.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 md:gap-6">
          {guides.map((guide) => (
            <article
              key={guide._id}
              className="group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              {guide.featured && (
                <span className="absolute right-4 top-4 rounded-full bg-purple-300/80 px-3 py-1 text-xs font-medium dark:bg-purple-600/50">
                  Featured
                </span>
              )}
              <div
                className={cn(
                  "flex h-full flex-col justify-between space-y-4",
                  guide.featured ? "pt-6" : "",
                )}
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-medium tracking-tight">
                    {guide.title}
                  </h2>
                  {guide.description && (
                    <p className="text-muted-foreground">{guide.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  {guide.date && (
                    <p className="text-xs text-muted-foreground">
                      {formatDate(guide.date)}
                    </p>
                  )}
                  {guide.updated && (
                    <p className="text-xs italic text-muted-foreground">
                      Updated: {formatDate(guide.updated)}
                    </p>
                  )}
                </div>
              </div>
              <Link href={guide.slug} className="absolute inset-0">
                <span className="sr-only">View</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p>No guides published yet.</p>
      )}
    </MaxWidthWrapper>
  );
}
