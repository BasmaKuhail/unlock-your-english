import { HeroSection } from "@/components/sections/hero-section";
import { SiteHeader } from "@/components/layout/site-header";

export default function Home() {
  return (
    <div className="min-h-dvh overflow-hidden bg-canvas">
      <SiteHeader />
      <main>
        <HeroSection />
      </main>
    </div>
  );
}
