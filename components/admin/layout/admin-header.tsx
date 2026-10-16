"use client";

import Link from "next/link";

import { AdminAvatar } from "@/components/admin/ui/admin-avatar";
import { NotificationMenu } from "@/components/admin/ui/notification-menu";
import { useAdmin } from "@/context/admin-context";
import { adminPageLabels, adminPaths } from "@/lib/admin/content";
import type { AdminView } from "@/lib/admin/types";

export function AdminHeader({ view }: { view: AdminView }) {
  const { admin } = useAdmin();
  const viewLabel = adminPageLabels[view];
  const displayName = admin?.displayName?.trim() || "Administrator";

  return (
    <header className="sticky top-0 z-20 border-b border-[#e8eaf1] bg-white/90 px-5 py-4 backdrop-blur lg:px-10">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <Link className="text-[1.65rem] font-black tracking-[-0.09em] text-ink lg:hidden" href="/">uye.</Link>

        <div className="hidden items-center gap-2 text-sm text-ink/45 lg:flex">
          <span>Uye</span>
          <span>/</span>
          <span className="font-medium text-ink/75">{viewLabel}</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <NotificationMenu />
          <span className="hidden h-7 w-px bg-[#e8eaf1] sm:block" />
          <Link
            aria-label="View admin profile"
            className="flex items-center gap-3 rounded-full p-1 transition hover:bg-[#f3f5fa]"
            href={adminPaths.profile}
          >
            <span className="hidden text-right sm:block">
              <span className="block text-xs font-bold">{displayName}</span>
              <span className="block text-[11px] text-ink/45">Admin</span>
            </span>
            <AdminAvatar className="h-9 w-9 rounded-full" />
          </Link>
        </div>
      </div>
    </header>
  );
}
