import Link from "next/link";
import { Post } from "contentlayer/generated";

import { cn, formatDate, placeholderBlurhash } from "@/lib/utils";
import BlurImage from "@/components/shared/blur-image";

import Author from "./author";

export function BlogCard({
  data,
  priority,
  horizontale = false,
}: {
  data: Post & {
    blurDataURL: string;
  };
  priority?: boolean;
  horizontale?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative",
        horizontale
          ? "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6"
          : "flex flex-col space-y-2",
      )}
    >
      {data.image && (
        <div className="w-full overflow-hidden rounded-xl border">
          <BlurImage
            alt={data.title}
            blurDataURL={data.blurDataURL ?? placeholderBlurhash}
            className={cn(
              "size-full object-cover object-center",
              horizontale ? "lg:h-72" : null,
            )}
            width={0}
            height={0}
            priority={priority}
            placeholder="blur"
            src={data.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div
        className={cn(
          "flex flex-1 flex-col",
          horizontale ? "justify-center" : "justify-between",
        )}
      >
        <div className="w-full">
          <h2 className="my-1.5 line-clamp-2 font-heading text-2xl">
            {data.title}
          </h2>
          {data.description && (
            <p className="line-clamp-2 text-muted-foreground">
              {data.description}
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center space-x-3">
          <div className="flex items-center -space-x-2">
            {data.authors.map((author) => (
              <Author username={author} key={data._id + author} imageOnly />
            ))}
          </div>

          <div className="flex flex-col items-center space-x-3">
            {data.date && (
              <p
                className={cn(
                  "text-muted-foreground",
                  data.updated ? "text-xs" : "text-sm",
                )}
              >
                {formatDate(data.date)}
              </p>
            )}
            {data.updated && (
              <p className="text-xs italic text-muted-foreground">
                Updated: {formatDate(data.updated)}
              </p>
            )}
          </div>
        </div>
      </div>
      <Link href={data.slug} className="absolute inset-0">
        <span className="sr-only">View Article</span>
      </Link>
    </article>
  );
}
