import { HeroSection } from "@/components/sections/hero-section";
import { SiteHeader } from "@/components/layout/site-header";
import { AboutSection } from "@/components/sections/landing/about-section";
import { ApproachSection } from "@/components/sections/landing/approach-section";
import { ClosingSection } from "@/components/sections/landing/closing-section";
import { ContactSection } from "@/components/sections/landing/contact-section";
import { HowItWorksSection } from "@/components/sections/landing/how-it-works-section";
import { ProgrammeSection } from "@/components/sections/landing/programme-section";
import { TeamSection } from "@/components/sections/landing/team-section";
import { WhyUyeSection } from "@/components/sections/landing/why-uye-section";

export default function Home() {
  return (
    <div className="min-h-dvh overflow-x-clip bg-canvas">
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <ProgrammeSection />
        <HowItWorksSection />
        <ApproachSection />
        <WhyUyeSection />
        <TeamSection />
        <ContactSection />
        <ClosingSection />
      </main>
    </div>
  );
}
