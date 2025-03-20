import { Body } from "@react-email/body";
import { Button } from "@react-email/button";
import { Column } from "@react-email/column";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Link } from "@react-email/link";
import { Preview } from "@react-email/preview";
import { Row } from "@react-email/row";
import { Section } from "@react-email/section";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";

type SubscriptionEmailProps = {
  actionUrl: string;
  firstName: string;
  mailType: "confirm" | "welcome";
  siteName: string;
  baseUrl: string;
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: {
    name: string;
    url: string;
  }[];
};

const PropDefaults: SubscriptionEmailProps = {
  firstName: "",
  mailType: "welcome",
  steps: [
    {
      id: 1,
      Description: (
        <li className="mb-2" key={1}>
          <strong>Check out our Local SEO books!</strong>{" "}
          <Link href="https://seolocal.markets/pricing">
            With the promo code <strong>EBOOK6</strong>
          </Link>
          , you get a $6 discount on our Mastering Local SEO eBooks.
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-2" key={2}>
          <strong>Buy our SEO book as a gift.</strong> We offer a wide range of
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
        <li className="mb-2" key={3}>
          <strong>SEO Tools and guides.</strong> On our blog and guides, we
          present a wide range of SEO tools and guides to help you with your SEO
          strategy.{" "}
          <Link href="https://seolocal.markets/blog">Explore our blog</Link>.
        </li>
      ),
    },
    {
      id: 4,
      Description: (
        <li className="mb-2" key={4}>
          <strong>Get 10% on WhiteSpark plans!</strong> A local SEO tool that
          specializes in local search and citation building. {` `}
          <Link href="https://whitespark.ca/?via=calin" className="font-bold">
            Visit WhiteSpark
          </Link>
          .
        </li>
      ),
    },
    {
      id: 5,
      Description: (
        <li className="mb-2" key={5}>
          <strong>Leave us a review.</strong> If you bought a product, please
          leave a review to help others decide.{" "}
          <Link href="https://seolocal.markets">SEO.eBook</Link>.
        </li>
      ),
    },
  ],
  links: [
    {
      name: "Blog",
      url: "https://seolocal.markets/blog",
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
  actionUrl: "",
  baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
};

const NewsletterSubscriptionEmail = ({
  actionUrl,
  firstName,
  mailType,
  siteName = PropDefaults.siteName,
  baseUrl = PropDefaults.baseUrl,
  steps = PropDefaults.steps,
  links = PropDefaults.links,
}: SubscriptionEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {mailType === "confirm"
        ? "The Confirm newsletter subscription email for"
        : "Welcome to our newsletter from"}{" "}
      {siteName}
    </Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-5 pb-12">
          <Link
            href={baseUrl}
            className="flex items-center justify-center"
            target="_blank"
          >
            <Img
              src={`${baseUrl}/static/seo-ebook-logo.png`}
              width="100%"
              height="48"
              alt="SeoEbook logo"
              className="my-8 object-contain"
            />
          </Link>
          <Text className="text-base">
            Hello {firstName ? firstName : "future SEO master"},
          </Text>
          <Text className="text-base">
            Welcome to <span className="font-bold">{siteName}</span> newsletter!{" "}
            {mailType === "confirm"
              ? "You have one more step to complete. Click the link below to confirm your subscription."
              : "You are now subscribed to our newsletter, but you can unsubscribe at any time, by clicking the link in the email footer."}
          </Text>
          <Text className="text-base">
            {mailType === "confirm"
              ? "You will be redirected to our website to confirm your subscription."
              : "Thank you for subscribing to our newsletter. We will not bother you with unnecessary emails."}
          </Text>
          <Section className="my-5 text-center">
            {mailType === "confirm" ? (
              <Button
                className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-base text-white no-underline"
                href={actionUrl}
                target="_blank"
              >
                Confirm Subscription
              </Button>
            ) : null}
          </Section>

          {mailType === "confirm" ? (
            <Section>
              <Text className="text-base">This link expires in 7 days! </Text>
              <Text className="text-base">
                If you did not try to subscribe to our {siteName} newsletter,
                you can safely ignore this email.
              </Text>
            </Section>
          ) : (
            <Section>
              <Text className="text-base">What you can do next:</Text>
              <ul>{steps?.map(({ Description }) => Description)}</ul>
            </Section>
          )}
          <Text className="text-base">Best,</Text>
          <Text className="text-base font-bold">{siteName} Team,</Text>
          <Hr className="my-4 border-t-2 border-gray-300" />

          <Section className="mt-45">
            <Row>
              {mailType === "welcome"
                ? links?.map((link) => (
                    <Column key={link.name}>
                      <Link
                        href={link.url}
                        className="font-bold text-black underline"
                      >
                        {link.name}
                      </Link>{" "}
                      <span className="text-cyan-500">→</span>
                    </Column>
                  ))
                : null}
            </Row>
          </Section>
          {mailType === "welcome" ? (
            <Section>
              <Text className="text-sm text-gray-600">
                You’re receiving this email because you successfully subscribed
                to {siteName} newsletter.
              </Text>
              <Text className="text-sm text-gray-600">
                Don&apos;t want to receive our newsletter anymore?{" "}
                <Link href={actionUrl} className="font-bold underline">
                  Unsubscribe here
                </Link>
              </Text>
            </Section>
          ) : (
            <Section>
              <Text className="text-sm text-gray-600">
                You’re receiving this email because you requested to subscribe
                to {siteName} newsletter.
              </Text>
              <Text className="text-sm text-gray-600">
                By subscribing, you agree to our{" "}
                <Link
                  href="https://seolocal.markets/terms"
                  className="font-bold underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="https://seolocal.markets/privacy"
                  className="font-bold underline"
                >
                  Privacy Policy
                </Link>
              </Text>
            </Section>
          )}
          <Text className="text-sm text-gray-600">
            Mastering Local SEO eBook
          </Text>
          <Text className="text-sm text-gray-600">
            A product powered by{" "}
            <Link
              href="https://webscript.ro/en"
              className="font-bold text-orange-600 underline"
            >
              WebScript
            </Link>
            <span className="ml-2 text-orange-500">→</span>
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default NewsletterSubscriptionEmail;
