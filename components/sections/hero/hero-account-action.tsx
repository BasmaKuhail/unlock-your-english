"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { useHomeLanguage } from "@/context/home-language-context";
import { useHomeAccount } from "@/context/home-account-context";

export function HeroAccountAction() {
  const { content: homeContent, isArabic } = useHomeLanguage();
  const { account, isLoading } = useHomeAccount();

  if (isLoading || account?.role === "Learner") return null;

  const action = account?.role === "Admin"
    ? { href: "/admin", label: isArabic ? "انتقل إلى لوحة التحكم" : "Go to dashboard" }
    : homeContent.hero.primaryAction;

  return (
    <Button href={action.href}>
      {action.label}
      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Button>
  );
}
