import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type MagicLinkEmailProps = {
  actionUrl: string;
  firstName: string;
  mailType: "login" | "register";
  siteName: string;
  baseUrl: string;
};

const MagicLinkEmail = ({
  firstName = "",
  actionUrl,
  mailType,
  siteName,
  baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
}: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>
      The {mailType === "login" ? "Sign in" : "Activate Account"} email for{" "}
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
            Welcome to <span className="font-bold">{siteName}</span> ! Click the
            link below to {mailType === "login" ? "sign in to" : "activate"}{" "}
            your account.
          </Text>
          <Section className="my-5 text-center">
            <Button
              className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-base text-white no-underline"
              href={actionUrl}
              target="_blank"
            >
              {mailType === "login" ? "Sign in" : "Activate Account"}
            </Button>
          </Section>
          <Text className="text-base">
            This link expires in 24 hours and can only be used once.
          </Text>
          {mailType === "login" ? (
            <Text className="text-base">
              If you did not try to log into your account, you can safely ignore
              it.
            </Text>
          ) : null}
          <Text className="text-base">Best,</Text>
          <Text className="text-base font-bold">{siteName} Team,</Text>
          <Hr className="my-4 border-t-2 border-gray-300" />
          {mailType === "register" ? (
            <Section>
              <Text className="text-sm text-gray-600">
                You’re receiving this email because you requested to sign up for{" "}
                {siteName}.
              </Text>
              <Text className="text-sm text-gray-600">
                By signing up, you agree to our{" "}
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
          ) : (
            <Text className="text-sm text-gray-600">
              You’re receiving this email because you requested a sign-in link
              for {siteName}.
            </Text>
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

export default MagicLinkEmail;
