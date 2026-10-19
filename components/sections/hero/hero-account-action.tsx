"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { homeContent } from "@/content/home";
import { useHomeAccount } from "@/context/home-account-context";

export function HeroAccountAction() {
  const { account, isLoading } = useHomeAccount();

  if (isLoading || account?.role === "Learner") return null;

  const action = account?.role === "Admin"
    ? { href: "/admin", label: "Go to dashboard" }
    : homeContent.hero.primaryAction;

  return (
    <Button href={action.href}>
      {action.label}
      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Button>
  );
}
