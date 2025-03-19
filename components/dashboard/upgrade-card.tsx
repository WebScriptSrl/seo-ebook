import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UpgradeCard() {
  return (
    <Card className="md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
      <CardHeader className="md:max-xl:px-4">
        <CardTitle className="text-gradient_cyan-red">
          eBooks Discount
        </CardTitle>
        <CardDescription>
          Get <span className="text-primary">38% off on all eBooks</span> for a
          limited time only. Upgrade your SEO skills
        </CardDescription>
      </CardHeader>
      <CardFooter className="md:max-xl:px-4">
        <Link
          href="/pricing"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "w-full",
          )}
        >
          Buy Now
        </Link>
      </CardFooter>
    </Card>
  );
}
