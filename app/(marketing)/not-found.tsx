import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-gradient_cyan-red font-mono text-6xl font-bold lg:text-9xl">
        404
      </h1>
      <Image
        src="/_static/illustrations/not-found.svg"
        alt="404"
        width={500}
        height={500}
        className="pointer-events-none mb-5 mt-6 dark:invert"
      />
      <p className="text-balance px-4 text-center text-2xl font-medium">
        Page not found. Back to{" "}
        <Link
          href="/"
          className="text-muted-foreground underline underline-offset-4 hover:text-purple-500"
        >
          Home?
        </Link>
      </p>
    </div>
  );
}
