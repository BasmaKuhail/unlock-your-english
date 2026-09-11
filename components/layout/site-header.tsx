import { homeContent } from "@/content/home";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10 lg:py-7">
      <Logo label={homeContent.brand} />

      <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
        {homeContent.navigation.map((item) => (
          <a
            className="text-sm font-medium text-ink/65 transition-colors hover:text-ink"
            href={item.href}
            key={item.label}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <Button href="/login">Log in</Button>
    </header>
  );
}
