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

interface SeoEbookWelcomeEmailProps {
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: {
    name: string;
    url: string;
  }[];
  siteName: string;
  firstName?: string;
  actionUrl: string;
  baseUrl?: string;
}

const PropDefaults: SeoEbookWelcomeEmailProps = {
  steps: [
    {
      id: 1,
      Description: (
        <li className="mb-20" key={1}>
          <strong>Start with a 38% discount.</strong>{" "}
          <Link href="https://seolocal.markets/pricing">
            See our pricing, we have a big discount on our eBooks
          </Link>
          , or choose a hardcover or paperback version.
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-20" key={2}>
          <strong>Check out our book formats.</strong> We offer a wide range of
          formats for you to choose from.{" "}
          <Link href="https://seolocal.markets/pricing">
            Learn more about our book formats
          </Link>
          .
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-20" key={3}>
          <strong>What you will learn.</strong> Our eBook covers everything you
          need to know about mastering Local SEO.{" "}
          <Link href="https://seolocal.markets/docs">Explore the docs</Link>.
        </li>
      ),
    },
    {
      id: 4,
      Description: (
        <li className="mb-20" key={4}>
          <strong>Quick and easy payment.</strong> We offer a secure payment
          gateway for all your transactions. With almost instant access to your
          eBook.{" "}
          <Link href="https://seolocal.markets/pricing">
            Buy now with 38% discount
          </Link>
          .
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
      name: "Blog",
      url: "https://seolocal.markets/blog",
    },
  ],
  siteName: "SEO.eBook",
  actionUrl: "https://seolocal.markets/pricing",
  baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
};

export const SeoEbookWelcomeEmail = ({
  steps = PropDefaults.steps,
  links = PropDefaults.links,
  siteName = PropDefaults.siteName,
  firstName,
  actionUrl = PropDefaults.actionUrl,
  baseUrl = PropDefaults.baseUrl,
}: SeoEbookWelcomeEmailProps) => {
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
        <Preview>Welcome to {siteName} | Learn how to master Local SEO</Preview>
        <Body className="bg-offwhite font-sans text-base">
          <Container className="bg-white p-4">
            <Img
              src={`${baseUrl}/static/mastering-local-seo-email-header.jpg`}
              width="100%"
              height="250"
              alt="SeoEbook header"
              className="my-20 object-contain"
            />
            <Heading className="my-0 text-center leading-8">
              Welcome to {siteName}!
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  Congratulations! You&apos;re about to{" "}
                  <strong>start mastering Local SEO</strong> with our new book,
                  and we&apos;re excited to have you on board.
                </Text>

                <Text className="text-base">
                  Here&apos;s how to get started:
                </Text>
              </Row>
            </Section>

            <ul>{steps?.map(({ Description }) => Description)}</ul>

            <Section className="text-center">
              <Button
                className="bg-brand rounded-lg px-[18px] py-3 text-white"
                href={actionUrl}
              >
                Check out our pricing
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
                    href="https://seolocal.markets/unsubscribe"
                    className="font-bold"
                  >
                    Unsubscribe
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

export default SeoEbookWelcomeEmail;
