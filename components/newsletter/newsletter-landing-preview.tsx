import { placeholderBlurhash } from "@/lib/utils";
import BlurImage from "@/components/shared/blur-image";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function NewsletterLandingPreview() {
  return (
    <div className="mx-auto flex justify-center pb-6 sm:pb-16 md:max-w-screen-md lg:max-w-4xl">
      <MaxWidthWrapper>
        <div className="rounded-xl md:bg-muted/20 md:p-3.5 md:ring-1 md:ring-inset md:ring-border">
          <div className="relative aspect-video overflow-hidden rounded-xl border md:rounded-lg">
            <BlurImage
              className="size-full object-cover object-center dark:opacity-95"
              src="/_static/product/mastering-local-seo-hardcover-book-main.avif"
              alt="Mastering Local SEO Hardcover Book Preview"
              placeholder="blur"
              blurDataURL={placeholderBlurhash}
              width={1200}
              height={600}
              priority
              loading="eager"
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
