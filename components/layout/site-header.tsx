"use client";

import { useHomeLanguage } from "@/context/home-language-context";

import { SiteAccount } from "@/components/layout/site-account";
import { Logo } from "@/components/ui/logo";

export function SiteHeader() {
  const { content: homeContent, isArabic, toggleLanguage } = useHomeLanguage();
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-5 sm:px-8 lg:px-10 lg:py-7">
      <Logo label={homeContent.brand} />

      <nav aria-label={isArabic ? "التنقل الرئيسي" : "Main navigation"} className="hidden items-center gap-8 lg:flex">
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

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
          title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
          className="flex h-11 items-center gap-1.5 rounded-full border border-brand/15 px-3 text-sm font-semibold text-brand transition-colors hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <ellipse cx="12" cy="12" rx="4" ry="9" />
            <path d="M3 12h18M5 6.5h14M5 17.5h14" />
          </svg>
          <span lang={isArabic ? "en" : "ar"}>{isArabic ? "EN" : "ع"}</span>
        </button>
        <SiteAccount />
      </div>
    </header>
  );
}
