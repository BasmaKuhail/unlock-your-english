"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { homeContent } from "@/content/home";
import { arabicHomeContent } from "@/content/home-ar";

const HomeLanguageContext = createContext({
  content: homeContent as typeof homeContent | typeof arabicHomeContent,
  isArabic: false,
  toggleLanguage: () => {},
});

export function HomeLanguageProvider({ children }: { children: ReactNode }) {
  const [isArabic, setIsArabic] = useState(false);
  return (
    <HomeLanguageContext.Provider value={{ content: isArabic ? arabicHomeContent : homeContent, isArabic, toggleLanguage: () => setIsArabic((value) => !value) }}>
      <div className="landing-page" lang={isArabic ? "ar" : "en"} dir={isArabic ? "rtl" : "ltr"}>{children}</div>
    </HomeLanguageContext.Provider>
  );
}

export const useHomeLanguage = () => useContext(HomeLanguageContext);
