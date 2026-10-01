import Link from "next/link";

import { BellIcon } from "@/components/admin/icons";
import { AdminLogoutButton } from "@/components/admin/layout/admin-logout-btn";
import { AdminAvatar } from "@/components/admin/ui/admin-avatar";
import { adminPageLabels, adminPaths } from "@/lib/admin/content";
import type { AdminProfile, AdminView } from "@/lib/admin/types";

export function AdminHeader({
  adminProfile,
  view,
}: {
  adminProfile: AdminProfile;
  view: AdminView;
}) {
  const viewLabel = adminPageLabels[view];

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
          <AdminLogoutButton />
          <button aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/55 transition hover:bg-[#f3f5fa]" type="button">
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-brand" />
          </button>
          <span className="hidden h-7 w-px bg-[#e8eaf1] sm:block" />
          <Link
            aria-label="View admin profile"
            className="flex items-center gap-3 rounded-full p-1 transition hover:bg-[#f3f5fa]"
            href={adminPaths.profile}
          >
            <span className="hidden text-right sm:block">
              <span className="block text-xs font-bold">{adminProfile.name}</span>
              <span className="block text-[11px] text-ink/45">Admin</span>
            </span>
            <AdminAvatar className="h-9 w-9 rounded-full" />
          </Link>
        </div>
      </div>
    </header>
  );
}
