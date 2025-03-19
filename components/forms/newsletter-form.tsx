"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import getConfig from "@/config/cookie-config";
import { siteConfig } from "@/config/site";
import sendSubscriptionEmail from "@/lib/emails/subscription-confirm-mail";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/shared/icons";

const FormSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email.",
  }),
});

// TODO: Add cookie configuration to remeber the user's subscription

export function NewsletterForm() {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [resendConfirmation, setResendConfirmation] = useState(false);
  const [resent, setResent] = useState(false);
  const [validationToken, setValidationToken] = useState<string | null>(null);
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState(false);
  const [path, setPath] = useState<string | null>(null);

  const memoizedSubscribed = useMemo(() => subscribed, [subscribed]);

  useEffect(() => {
    if (pathname) {
      setPath(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (sendConfirmationEmail === true && email) {
      handleSendMail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendConfirmationEmail, email]);

  useEffect(() => {
    if (resent === true) {
      handleSendMail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resent]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSendMail = () => {
    if (validationToken && email && path) {
      const promise = () =>
        new Promise(
          async (resolve) =>
            await sendSubscriptionEmail({
              path: path,
              to: email,
              mailType: "confirm",
              validationToken: validationToken,
            }).then(resolve),
        );

      toast.promise(promise, {
        loading: "Sending confirmation email...",
        success: () => {
          return "Confirmation email sent";
        },
        error: "Failed to send confirmation email",
      });
    }
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    setEmail(data.email);
    const promise = () =>
      new Promise((resolve) =>
        fetch("/api/newsletter", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .catch((error) => Promise.reject(error))
          .then(resolve),
      );

    toast.promise(promise, {
      loading: "Adding your email...",
      success: (res: any) => {
        setIsSubmitting(false);
        switch (res.status) {
          case 400:
            if (
              res.message.toLowerCase() === "Email is required".toLowerCase()
            ) {
              throw new Error(`${res.message}`);
            }
            if (
              res.message.toLowerCase() ===
              "Email already subscribed".toLowerCase()
            ) {
              setSubscribed(true);
              throw new Error(`${res.message}`);
            }
            break;

          case 401:
            if (
              res.message.toLowerCase() ===
              "A new email will be sent for confimation!".toLowerCase()
            ) {
              setValidationToken(res.data.validationToken);
              setResendConfirmation(true);
              return `${res.message}`;
            }

            if (
              res.message.toLowerCase() ===
              "Your subscription is pending confirmation!".toLowerCase()
            ) {
              setValidationToken(res.data.validationToken);
              setResendConfirmation(true);
              return `${res.message}`;
            }
            break;
          case 201:
            if (res.message.includes("A confirmation email will be sent at")) {
              setValidationToken(res.data.validationToken);
              setSendConfirmationEmail(true);
              return `${res.message}`;
            }
            break;
          case 500:
            throw new Error(res.error);

          default:
            throw new Error("Something went wrong");
        }
      },
      error: (res: any) => {
        setIsSubmitting(false);
        return res.message;
      },
    });
    form.reset();
  }

  return (
    <Suspense
      fallback={<Skeleton className="hidden h-16 w-28 rounded-full lg:flex" />}
    >
      {resendConfirmation && (
        <div className="flex size-full flex-col justify-end space-y-2 sm:max-w-sm">
          {!resent && (
            <p className="text-center text-sm sm:text-left">
              Send a new confirmation email?
            </p>
          )}
          {resent && (
            <p className="text-center text-sm sm:text-left">
              Please check your inbox and click the confirmation link.
            </p>
          )}
          <Button
            onClick={() => {
              setResent(true);
            }}
            size="sm"
            rounded="full"
            className="min-w-40 max-w-40 self-center px-4 sm:self-end"
            disabled={resent}
          >
            Send
          </Button>
        </div>
      )}
      {!resendConfirmation && !subscribed && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col space-y-2 sm:max-w-sm"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`${"Subscribe to our newsletter"}`}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="rounded-full px-4"
                      placeholder={`${"johndoe@example.com"}`}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="sm"
              rounded="full"
              className="min-w-40 max-w-40 self-center px-4 sm:self-end"
              disabled={subscribed}
            >
              Subscribe
            </Button>
          </form>
        </Form>
      )}

      {memoizedSubscribed && (
        <div className="flex size-full flex-col justify-end space-y-2 text-muted-foreground sm:max-w-sm">
          <p className="text-center text-xs sm:text-left">
            Newsletter subscription active
          </p>
          <p className="text-center text-xs sm:text-left">
            Thank you for joining our newsletter!
          </p>
          <Link
            href="/"
            className="flex items-center justify-center space-x-1.5"
          >
            <Icons.logo />
            <span className="text-gradient_cyan-red font-urban text-xl font-bold">
              {siteConfig.name}
            </span>
          </Link>
        </div>
      )}
    </Suspense>
  );
}
