import { placeholderBlurhash } from "@/lib/utils";
import BlurImage from "@/components/shared/blur-image";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function PreviewLanding() {
  return (
    <div className="mx-auto pb-6 sm:pb-16 lg:max-w-6xl">
      <MaxWidthWrapper>
        <div className="rounded-xl md:bg-muted/20 md:p-3.5 md:ring-1 md:ring-inset md:ring-border">
          <div className="relative aspect-video overflow-hidden rounded-xl border md:rounded-lg">
            <BlurImage
              className="size-full object-cover object-center dark:opacity-95"
              src="/_static/product/mastering-local-seo-hardcover-book-main.avif"
              alt="Mastering Local SEO Hardcover Book Preview"
              placeholder="blur"
              blurDataURL={placeholderBlurhash}
              width={2000}
              height={1000}
              priority
              loading="eager"
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
