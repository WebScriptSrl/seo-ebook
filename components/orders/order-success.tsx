"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DownloadData, handleDownload } from "@/actions/handle-download";
import { Order } from "@prisma/client";
import { toast } from "sonner";

import { siteConfig } from "@/config/site";
import { getOrderEmails } from "@/lib/emails/email-actions";
import sendOrderEmail from "@/lib/emails/order-success-mail";
import { getConfirmedOrders } from "@/lib/order";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components//ui/separator";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Icons } from "@/components/shared/icons";

import { OrderDetails } from "./order-details";

interface OrderProps {
  sessionId: string;
}

export default function OrderSuccess({ sessionId }: OrderProps) {
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [errorTextData, setErrorTextData] = useState({
    title: "Order Confirmation",
    titleCta: "We couldn't confirm your order !",
    descriptionStart: "We could not confirm your order for",
    strongTxt: "SEO.eBook !",
    descriptionEnd: "Please try again or contact us for further assistance.",
    btnText: "Pricing",
    url: "/pricing",
  });
  const [textData, setTextData] = useState({
    title: "Order Confirmation",
    titleCta: "Your order is confirmed!",
    descriptionStart: "We have successfully confirmed your order for",
    strongTxt: "SEO.eBook platform.",
    descriptionEnd:
      "Your order details are sent to your email, and your download link is ready.",
    btnText: "Download eBook",
  });
  const [download, setDownload] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean | undefined>(undefined);
  const [validToken, setValidToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getEmails = getOrderEmails.bind(null, order?.id);
  const actionSendEmail = sendOrderEmail.bind(null, order, sessionId);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current === false) return;
    const fetchOrder = async () => {
      const response = await getConfirmedOrders(sessionId);
      if (!response) {
        setValidToken(false);
        setLoading(false);
        return;
      }
      setOrder(response);
      setValidToken(true);
    };
    setTimeout(() => {
      fetchOrder();
    }, 2000);
  }, [sessionId, isMounted]);

  useEffect(() => {
    if (order) {
      setValidToken(true);
      handleSendEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    if (emailSent === false) {
      sendSuccessOrderEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailSent]);

  const handleProductDownload = async () => {
    if (!order) {
      setBtnLoading(false);
      setErrorMessage("Order not found!");
      return;
    }
    const data: DownloadData = { orderId: order.id, case: "download" };
    toast.promise(handleDownload({ data }), {
      loading: "Preparing download...",
      success: (res: any) => {
        window.open(res.url, "_blank");
        updateDownload();
        return `Download started! Your eBook is on the way!`;
      },
      error: (error) => {
        setBtnLoading(false);
        setErrorMessage(error.message);
        return error.message;
      },
    });
  };

  const updateDownload = async () => {
    const data: DownloadData = { orderId: order?.id as string, case: "update" };
    toast.promise(handleDownload({ data }), {
      loading: "Updating download...",
      success: (res) => {
        setBtnLoading(false);
        setDownload(true);
        return `Your eBook download is ready! If the download failed, please contact us!`;
      },
      error: (error) => {
        setBtnLoading(false);
        setErrorMessage(error.message);
        return error.message;
      },
    });
  };

  const handleSendEmail = async () => {
    if (emailSent) {
      setLoading(false);
      return;
    }
    setLoading(true);
    toast.promise(await getEmails, {
      loading: "Checking order details...",
      success: (
        res: { delivered: boolean; sentAt: Date; deliveredAt: Date }[],
      ) => {
        const delivered = res.find((email) => email.delivered === true);
        const sentDate = res.find((email) => email.sentAt);
        if (delivered) {
          setEmailSent(true);
          setLoading(false);
          return `Order details were sent ${sentDate?.sentAt ? `on ${new Date(sentDate.sentAt).toLocaleString()} to: ${order?.email}` : "!"}`;
        }
        setEmailSent(false);
        return "We are sending your order details by email...";
      },
      error: (error) => {
        setLoading(false);
        setErrorMessage(error.message);
        return error.message;
      },
    });
  };

  const sendSuccessOrderEmail = async () => {
    if (emailSent) {
      setLoading(false);
      return;
    }
    setLoading(true);
    toast.promise(await actionSendEmail, {
      loading: "Sending order details...",
      success: () => {
        setEmailSent(true);
        setLoading(false);
        return `Order details are sent to ${order?.email}`;
      },
      error: (error) => {
        setLoading(false);
        return error.message;
      },
    });
  };

  return (
    <section className="space-y-2 pb-7 sm:py-5 lg:py-10">
      {loading && (
        <EmptyPlaceholder className="flex min-h-96 flex-col items-center justify-between">
          <div className="container flex w-full max-w-5xl flex-col items-center gap-8 pt-10 text-center">
            <h2 className="text-gradient_cyan-red text-balance font-urban text-3xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              {textData.title}
            </h2>
          </div>
          <Separator className="mx-auto my-12 w-1/2" />
          <p
            className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-lg sm:leading-8"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            Checking your order details...
          </p>
          <Icons.spinner className="size-8 animate-spin" />
        </EmptyPlaceholder>
      )}

      {!loading && (
        <div className="container flex max-w-5xl flex-col items-center gap-8 pt-10 text-center">
          <h2 className="text-gradient_cyan-red text-balance font-urban text-3xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
            {textData.title}
          </h2>

          <h3 className="text-balance font-urban text-2xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-[46px]">
            {validToken ? textData.titleCta : errorMessage}
          </h3>

          <p
            className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            {validToken ? textData.descriptionStart : ""}{" "}
            <strong className="text-gradient_indigo-purple">
              {validToken
                ? " one " +
                  order?.productName +
                  " on " +
                  textData.strongTxt +
                  " "
                : `Something went wrong! Check your email for the corect url!`}
            </strong>{" "}
            {validToken ? textData.descriptionEnd : "Please try again later."}
          </p>

          <div
            className="flex justify-center space-x-2 md:space-x-4"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            {!validToken && (
              <>
                <Link
                  href={errorTextData.url || "/"}
                  prefetch={true}
                  className={cn(
                    buttonVariants({ size: "lg", rounded: "full" }),
                    "gap-2",
                  )}
                >
                  <span>Home</span>
                  <Icons.arrowRight className="size-4" />
                </Link>

                <Link
                  href={"/login"}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                      rounded: "full",
                    }),
                    "px-5",
                  )}
                >
                  <Icons.logo className="mr-2 size-4" />
                  <p>
                    <span className="font-bold">Sign In</span>{" "}
                  </p>
                  <Icons.arrowRight className="ml-2 size-4" />
                </Link>
              </>
            )}

            {validToken && order?.status === "succeeded" && (
              <button
                onClick={() => {
                  setDownload(true),
                    setBtnLoading(true),
                    handleProductDownload();
                }}
                disabled={btnLoading || download}
                className={cn(
                  buttonVariants({ size: "lg", rounded: "full" }),
                  "gap-2",
                )}
              >
                <span>{textData.btnText}</span>
                {btnLoading ? (
                  <Icons.spinner className="size-4 animate-spin" />
                ) : (
                  <Icons.arrowUpRight className="size-4" />
                )}
              </button>
            )}
          </div>

          {!validToken && (
            <Link
              href={siteConfig.links.twitter}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  rounded: "full",
                }),
                "px-4",
              )}
              target="_blank"
            >
              <span className="mr-3">🌐</span>
              <span className="hidden md:flex">
                Stay updated with&nbsp;
              </span>{" "}
              SEO EBook on <Icons.twitter className="ml-2 size-3.5" />
            </Link>
          )}

          {validToken && (
            <p className="text-sm text-muted-foreground">
              <strong>Note!</strong> The download link{" "}
              <strong>expires in 24 hours</strong>. And it can only be{" "}
              <strong>used once</strong>.
            </p>
          )}
        </div>
      )}

      {!loading && validToken && <OrderDetails id={sessionId} />}
    </section>
  );
}
