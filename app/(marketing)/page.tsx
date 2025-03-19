import { infos } from "@/config/landing";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import Testimonials from "@/components/sections/testimonials";
import CallToAction from "@/components/shared/call-to-action";
import { ReviewCTA } from "@/components/shared/review-cta";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <PreviewLanding />
      <Powered />
      <BentoGrid />
      <InfoLanding data={infos[0]} reverse={true} />
      <Features />
      <InfoLanding data={infos[1]} />
      <Testimonials />
      <ReviewCTA />
      <CallToAction
        data={{
          titleCta: "Buy now",
          title: "Mastering Local SEO",
          descriptionStart: "You are just one step away from",
          descriptionEnd:
            "and building a brand that’s not only highly searchable but genuinely valued!",
          strongTxt: "unlocking the Local SEO secrets",
        }}
      />
    </>
  );
}
