"use client";

import Link from "next/link";

import { AdminAvatar } from "@/components/admin/ui/admin-avatar";
import { Button } from "@/components/ui/button";
import { useHomeLanguage } from "@/context/home-language-context";
import { useHomeAccount } from "@/context/home-account-context";

export function SiteAccount() {
  const { content: homeContent, isArabic } = useHomeLanguage();
  const { account, isLoading } = useHomeAccount();

  if (isLoading) {
    return <span aria-label={isArabic ? "جارٍ التحقق من تسجيل الدخول" : "Checking sign-in status"} aria-busy="true" className="h-12 w-28 rounded-full bg-brand/10" />;
  }

  if (!account) {
    return <Button href={homeContent.headerAction.href}>{homeContent.headerAction.label}</Button>;
  }

  const profile = (
    <>
      <span className="min-w-0 text-right">
        <span className="block max-w-20 truncate text-sm font-semibold text-ink sm:max-w-48">{account.name}</span>
        <span className="block text-xs text-ink/60">{isArabic ? (account.role === "Admin" ? "المشرف" : "متعلّم") : account.role}</span>
      </span>
      {account.role === "Admin" ? <AdminAvatar className="h-10 w-10 rounded-full" /> : (
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
          {account.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
        </span>
      )}
    </>
  );

  return account.role === "Admin" ? (
    <Link href="/admin/profile" aria-label={isArabic ? `عرض ملف ${account.name}` : `View profile for ${account.name}`} className="flex items-center gap-3 rounded-full p-1 transition hover:bg-brand/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
      {profile}
    </Link>
  ) : <div className="flex items-center gap-3" aria-label={isArabic ? `تم تسجيل الدخول باسم ${account.name}` : `Signed in as ${account.name}`}>{profile}</div>;
}
