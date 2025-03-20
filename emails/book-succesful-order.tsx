import type * as React from "react";
import { Body } from "@react-email/body";
import { Button } from "@react-email/button";
import { Column } from "@react-email/column";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Heading } from "@react-email/heading";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Link } from "@react-email/link";
import { Preview } from "@react-email/preview";
import { Row } from "@react-email/row";
import { Section } from "@react-email/section";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";

export type BillingDetails = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
};

interface SeoEbookOrderEmailProps {
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  order: {
    id: string;
    product: string;
    price: string;
    quantity: string | null;
    discount: string | null;
    currency: string;
    status?: string;
    "amount paid": string;
    "coupon code": string | null;
    "promo code": string;
    "payment method": string | null;
    date?: string;
    links?: {
      name: string | null;
      url: string | null;
    }[];
    downloadUrl?: string;
    customerId?: string;
    "billing details": BillingDetails | null;
  };
  links?: {
    name: string;
    url: string;
  }[];
  siteName?: string;
  firstName?: string;
  actionUrl?: string;
  baseUrl?: string;
}

const PropDefaults: SeoEbookOrderEmailProps = {
  order: {
    id: "Something went wrong!",
    product: "Mastering Local SEO",
    quantity: "1",
    discount: "6.00",
    price: "15.99",
    currency: "USD",
    "amount paid": "9.99",
    "promo code": "EBOOK6",
    "coupon code": null,
    "payment method": "Credit Card",
    date: new Date().toLocaleString(),
    downloadUrl: "https://seolocal.markets/",
    "billing details": {
      name: "John Doe",
      email: " [email protected]",
      phone: "+1 123 456 789",
      address: "1234 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
  },

  steps: [
    {
      id: 1,
      Description: (
        <li className="mb-20" key={1}>
          <strong>Stay updated with news.</strong>{" "}
          <Link href="https://seolocal.markets/blog">Check out our blog</Link>,
          and stay updated with the latest news in Local SEO.
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-20" key={2}>
          <strong>Buy the book as a gift.</strong> We offer a wide range of
          formats for you to choose from.{" "}
          <Link href="https://seolocal.markets/pricing" className="font-bold">
            And the Hardcover version is a great gift idea
          </Link>
          .
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-20" key={3}>
          <strong>SEO Tools and guides.</strong> We present a wide range of SEO
          tools and guides to help you with your SEO strategy.{" "}
          <Link href="https://seolocal.markets/guides">Explore our guides</Link>
          .
        </li>
      ),
    },
    {
      id: 4,
      Description: (
        <li className="mb-20" key={4}>
          <strong>Subscribe and make an account.</strong> Subscribe to our
          newsletter and create an account to get the latest news and offers.
          {` `}
          <Link href="https://seolocal.markets/register">
            Get your account ready
          </Link>
          .
        </li>
      ),
    },
    {
      id: 5,
      Description: (
        <li className="mb-20" key={4}>
          <strong>Leave us a review.</strong> Make sure to leave us a review on
          our website. Or, on Amazon.{" "}
          <Link href="https://seolocal.markets">SEO.eBook</Link>.
        </li>
      ),
    },
  ],
  links: [
    {
      name: "Main Page",
      url: "https://seolocal.markets",
    },
    {
      name: "About",
      url: "https://seolocal.markets/docs",
    },
    {
      name: "Guides",
      url: "https://seolocal.markets/guides",
    },
  ],
  siteName: "SEO.eBook",
  actionUrl: "https://seolocal.markets/blog",
  baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
};

export const SeoEbookOrderEmail = ({
  order = PropDefaults.order,
  steps = PropDefaults.steps,
  links = PropDefaults.links,
  siteName = PropDefaults.siteName,
  firstName,
  actionUrl = PropDefaults.actionUrl,
  baseUrl = PropDefaults.baseUrl,
}: SeoEbookOrderEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#2250f4",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Preview>Thank you for your Mastering Local SEO eBook order.</Preview>
        <Body className="bg-offwhite font-sans text-base">
          <Container className="bg-white p-4">
            <Img
              src={`${baseUrl}/static/mastering-local-seo-email-order-header.jpg`}
              width="100%"
              height="250"
              alt="SeoEbook header"
              className="my-20 object-contain"
            />
            <Heading className="my-0 text-center leading-8">
              Your {siteName} order{firstName ? "," + " " + firstName : ""}!
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  Congratulations, {firstName ? firstName : "future SEO master"}
                  ! You&apos;re about to{" "}
                  <strong>start mastering Local SEO</strong> with your new
                  eBook, and we&apos;re excited that you&apos;ve chosen{" "}
                  <strong>{siteName}</strong>.
                </Text>

                <Text className="text-base">
                  Here&apos;s your order summary:
                </Text>
              </Row>
            </Section>

            <Section>
              <ul>
                {Object.entries(order)
                  .filter(
                    ([key, value]) =>
                      value !== null &&
                      key !== "links" &&
                      key !== "downloadUrl" &&
                      key !== "customerId" &&
                      key !== "billing details",
                  )
                  .map(([key, value]) => (
                    <li key={key}>
                      <strong className="mr-5 capitalize italic">{key}:</strong>{" "}
                      {value?.toLocaleString()}
                    </li>
                  ))}
                <ul>
                  {order.links?.map(({ name, url }) => (
                    <li key={name}>
                      <Link
                        href={url ? url : "#"}
                        target="_blank"
                        className="font-bold underline"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </ul>

              <Hr className="my-4 border-t-2 border-gray-300" />
              <Text>
                <strong>Billing details:</strong>
              </Text>
              <ul>
                {order["billing details"] &&
                  Object.entries(order["billing details"])
                    .filter(([, value]) => value !== null)
                    .map(([key, value]) => (
                      <li key={key}>
                        <strong className="mr-5 capitalize italic">
                          {key}:
                        </strong>{" "}
                        {value?.toLocaleString()}
                      </li>
                    ))}
              </ul>
            </Section>
            <Section className="text-center">
              <Text className="text-lg">
                <strong>Download your eBook</strong>
              </Text>
              <Text className="text-base">
                You can <strong>access the download page</strong> using the
                button below.
              </Text>
              <Text className="text-base">
                On this page, you also have the order details.{" "}
                <strong>This page is private</strong> and can only be accessed
                with the link below.
              </Text>
              <Text className="text-base">
                <strong>Note!</strong> The download link{" "}
                <strong>expires in 24 hours</strong>. And it can only be{" "}
                <strong>used once</strong>.
              </Text>
              <Text className="text-base">
                Enjoy your reading, and happy learning!
              </Text>
              <Button
                className="bg-brand rounded-lg px-[18px] py-3 text-white"
                href={order.downloadUrl}
              >
                Access download page
              </Button>
            </Section>

            <Hr className="my-4 border-t-2 border-gray-300" />

            <Section>
              <Row>
                <Text className="text-base">
                  What&apos;s next? Here are a few steps to get you started:
                </Text>
              </Row>
            </Section>

            <ul>{steps?.map(({ Description }) => Description)}</ul>

            <Section className="text-center">
              <Button
                className="bg-brand rounded-lg px-[18px] py-3 text-white"
                href={actionUrl}
              >
                Check out our blog
              </Button>
            </Section>

            <Section className="mt-45">
              <Row>
                {links?.map((link) => (
                  <Column key={link.name}>
                    <Link
                      href={link.url}
                      className="font-bold text-black underline"
                    >
                      {link.name}
                    </Link>{" "}
                    <span className="text-cyan-500">→</span>
                  </Column>
                ))}
              </Row>
            </Section>
          </Container>

          <Container className="mt-20">
            <Section>
              <Row>
                <Column className="px-20 text-right">
                  <Link
                    href="https://seolocal.markets/docs"
                    className="font-bold"
                  >
                    Documentation
                  </Link>
                </Column>
                <Column className="text-left">
                  <Link
                    href="https://seolocal.markets/dashboard"
                    className="font-bold"
                  >
                    Manage Account
                  </Link>
                </Column>
              </Row>
            </Section>
            <Text className="mb-45 text-center text-gray-400">
              Mastering Local SEO eBook
            </Text>
            <Text className="text-center text-sm text-gray-600">
              A product powered by{" "}
              <Link
                href="https://webscript.ro/en"
                className="font-bold text-orange-600"
              >
                WebScript
              </Link>
              <span className="ml-2 text-cyan-500">→</span>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SeoEbookOrderEmail;
