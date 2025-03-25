"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { NewsletterSubscriptionData } from "@/actions/newsletter-subscription";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewsletterState, User, UserRole } from "@prisma/client";
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

import { SectionColumns } from "../dashboard/section-columns";
import { Icons } from "../shared/icons";

interface NewsletterFormProps {
  data: NewsletterSubscriptionData;
}

const FormSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email.",
  }),
});

export function DashboardNewsletterForm({
  status,
  newsletterData,
  message,
  userMail,
}: {
  status: number;
  newsletterData: NewsletterFormProps;
  message?: string;
  userMail: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [cookieValid, setCookieValid] = useState(false);
  const [subscribed, setSubscribed] = useState<NewsletterState>("NEW");
  const [unsubscribed, setUnsubscribed] = useState<boolean>(false);
  const [subscriptionData, setSubscriptionData] =
    useState<NewsletterFormProps | null>(null);
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState(false);
  const [validationToken, setValidationToken] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: userMail,
    },
  });

  // TODO: NEW cookie configuration to remeber the user's subscription
  // Get the cookie configuration
  const { cookie } = getConfig();
  const { subscription } = getConfig().categories.functional.services;

  useEffect(() => {
    if (status === 404 || status === 500) return;
    if (newsletterData) {
      setSubscriptionData(newsletterData);
      if (newsletterData.data.validationToken) {
        setValidationToken(newsletterData.data.validationToken);
      }
    }
  }, [newsletterData, status, message]);

  useEffect(() => {
    const subscriptionCookie = Cookies.get(subscription.cookieName);
    if (subscriptionCookie) {
      const { subscribed, expiresDate } = JSON.parse(subscriptionCookie);
      if (subscribed && new Date(expiresDate) > new Date(Date.now())) {
        setCookieValid(true);
        return;
      }
      if (new Date(expiresDate) < new Date(Date.now())) {
        Cookies.remove(subscription.cookieName);
        setCookieValid(false);
        return;
      }
    }
    setCookieValid(false);
  }, [subscribed, subscription.cookieName]);

  useEffect(() => {
    if (cookieValid) {
      setUnsubscribed(false);
      setSubscribed("CONFIRMED");
      return;
    }

    if (subscriptionData && subscriptionData.data.subscribed === "CONFIRMED") {
      setUnsubscribed(false);
      setSubscribed("CONFIRMED");
      return;
    }

    if (subscriptionData && subscriptionData.data.subscribed === "PENDING") {
      setUnsubscribed(false);
      setSubscribed("PENDING");
      return;
    }

    if (
      subscriptionData &&
      subscriptionData.data.subscribed === "UNSUBSCRIBED"
    ) {
      setSubscribed("UNSUBSCRIBED");
      setUnsubscribed(true);
      return;
    }

    setSubscribed("NEW");
    setUnsubscribed(true);
  }, [cookieValid, subscriptionData, unsubscribed]);

  useEffect(() => {
    if (sendConfirmationEmail) {
      handleSendMail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendConfirmationEmail]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setSubmitting(true);
    form.reset();
    const promise = () =>
      new Promise((resolve) =>
        fetch("/api/newsletter", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            getSetCookie: cookie.name,
            append: subscription.cookieName,
          },
        })
          .then((res) => res.json())
          .catch((error) => Promise.reject(error))
          .then(resolve),
      );

    toast.promise(promise, {
      loading: "Adding your email...",
      success: (res: any) => {
        if (res.message === "Email already subscribed") {
          setSubscribed("CONFIRMED");
          throw new Error(`${res.message}`);
        }

        if (res.message.includes("Subscribed to newsletter")) {
          setSubscribed("CONFIRMED");
          return `${res.message}`;
        }

        if (res.message.includes("A new email will be sent for confimation")) {
          setSubscribed("PENDING");
          setValidationToken(res.data.validationToken);
          setSendConfirmationEmail(true);
          return `${res.message}`;
        }

        if (res.message.includes("A confirmation email will be sent at")) {
          setSubscribed("PENDING");
          setValidationToken(res.data.validationToken);
          setSendConfirmationEmail(true);
          return `${res.message}`;
        }

        throw new Error("Something went wrong");
      },
      error: (data: any) => {
        return data.message;
      },
    });
  }

  const handleSendMail = () => {
    if (sendConfirmationEmail === true && validationToken) {
      const promise = () =>
        new Promise(
          async (resolve) =>
            await sendSubscriptionEmail({
              path: "dashboard/settings",
              to: userMail,
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

  return (
    <Suspense
      fallback={<Skeleton className="hidden h-16 w-28 rounded-full lg:flex" />}
    >
      {unsubscribed && (
        <SectionColumns
          title="Newsletter subscription"
          description="
    Subscribe to our newsletter to receive the latest news and updates."
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col space-y-5 sm:max-w-sm"
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
                        disabled={submitting}
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
              >
                Subscribe
              </Button>
            </form>
          </Form>
        </SectionColumns>
      )}

      {subscribed === "NEW" ||
        (subscribed === "UNSUBSCRIBED" && (
          <SectionColumns
            title="Newsletter subscription"
            description="
        Subscribe to our newsletter to receive the latest news and updates."
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col space-y-5 sm:max-w-sm"
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
                          disabled={submitting}
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
                >
                  Subscribe
                </Button>
              </form>
            </Form>
          </SectionColumns>
        ))}

      {subscribed === "PENDING" && (
        <SectionColumns
          title="Newsletter subscription"
          description="We have detected a pending confirmation subscription. Please check your email."
        >
          <div className="flex flex-col justify-end space-y-2 sm:max-w-sm">
            <p className="text-left text-sm sm:text-left">
              Check your inbox and click the confirmation link. If you
              didn&apos;t find the email, also check the spam folder.
            </p>
            <Button
              size="sm"
              rounded="full"
              className="min-w-40 max-w-40 self-center px-4 sm:self-end"
              disabled={sendConfirmationEmail}
              onClick={() => setSendConfirmationEmail(true)}
            >
              Resend
            </Button>
          </div>
        </SectionColumns>
      )}

      {subscribed === "CONFIRMED" && (
        <SectionColumns
          title="Newsletter subscription"
          description="You are ready to receive our newsletter."
        >
          <div className="flex flex-col justify-end space-y-2 sm:max-w-sm">
            <p className="text-left text-sm sm:text-left">
              Thank you for subscribing to our newsletter. We will not bother
              you with unnecessary emails.
            </p>
            <p className="text-left text-sm text-muted-foreground sm:text-left">
              Also, you can unsubscribe at any time by clicking the{" "}
              <strong className="italic">Unsubscribe link</strong> in the future
              emails received from us.
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
        </SectionColumns>
      )}
    </Suspense>
  );
}
