import Image from "next/image";
import Link from "next/link";
import webscriptLogo from "@/assets/images/webscript-logo.svg";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const logos = [
  {
    title: "WebScript",
    href: "https://webscript.ro/en",
    src: webscriptLogo,
  },
];

const authors = [
  {
    title: "Crafted by",
    author: "Calin S.",
    href: "https://calin.codes",
    description: "Full Stack Developer & SEO Expert",
  },
];

export default function Powered() {
  return (
    <section className="py-14 text-muted-foreground">
      <MaxWidthWrapper>
        <h2 className="text-center text-sm font-semibold uppercase">
          Powered by
        </h2>

        {logos.length < 4 && (
          <div className="mt-10 flex flex-col items-center justify-center gap-8">
            {logos.map((logo) => (
              <Link
                target="_blank"
                key={logo.title}
                href={logo.href}
                aria-label={logo.title}
                className="duration-250 grayscale transition hover:text-foreground hover:grayscale-0"
              >
                <Image
                  src={logo.src}
                  alt={logo.title}
                  className="h-24 md:h-32"
                />
              </Link>
            ))}
          </div>
        )}

        {logos.length > 4 && (
          <div>
            <div className="mt-10 grid grid-cols-2 place-items-center gap-8 md:grid-cols-4">
              {logos.slice(0, 4).map((logo) => (
                <Link
                  target="_blank"
                  key={logo.title}
                  href={logo.href}
                  aria-label={logo.title}
                  className="duration-250 grayscale transition hover:text-foreground hover:grayscale-0"
                >
                  <Image src={logo.src} alt={logo.title} />
                </Link>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 place-items-center gap-8 md:mt-10 md:grid-cols-4">
              {logos.slice(4, 8).map((logo) => (
                <Link
                  target="_blank"
                  key={logo.title}
                  href={logo.href}
                  aria-label={logo.title}
                  className="duration-250 grayscale transition hover:text-foreground hover:grayscale-0"
                >
                  <Image src={logo.src} alt={logo.title} />
                </Link>
              ))}
            </div>
          </div>
        )}

        <h2 className="mt-8 text-center text-sm font-semibold uppercase">
          Crafted by
        </h2>

        <div className="mt-10 flex items-center justify-center gap-8 text-center">
          {authors.map((author) => (
            <Link
              target="_blank"
              key={author.title}
              href={author.href}
              aria-label={author.title}
              className="flex flex-col items-center justify-center gap-2 hover:text-foreground"
            >
              <span className="text-gradient_cyan-red text-4xl font-semibold">
                {author.author}
              </span>
              <span className="text-md text-center">{author.description}</span>
            </Link>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
