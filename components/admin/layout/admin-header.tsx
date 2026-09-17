import Link from "next/link";

import { BellIcon } from "@/components/admin/icons";
import { adminNavigation, adminProfile } from "@/lib/admin/content";
import type { AdminView } from "@/lib/admin/types";

export function AdminHeader({ view }: { view: AdminView }) {
  const viewLabel = adminNavigation.find((item) => item.value === view)?.label;

  return <header className="sticky top-0 z-20 border-b border-[#e8eaf1] bg-white/90 px-5 py-4 backdrop-blur lg:px-10"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4"><Link className="text-[1.65rem] font-black tracking-[-0.09em] text-ink lg:hidden" href="/">uye.</Link><div className="hidden items-center gap-2 text-sm text-ink/45 lg:flex"><span>Uye</span><span>/</span><span className="font-medium text-ink/75">{viewLabel}</span></div><div className="ml-auto flex items-center gap-3"><button aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/55 transition hover:bg-[#f3f5fa]" type="button"><BellIcon className="h-5 w-5" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-brand" /></button><span className="hidden h-7 w-px bg-[#e8eaf1] sm:block" /><span className="hidden text-right sm:block"><span className="block text-xs font-bold">{adminProfile.name}</span><span className="block text-[11px] text-ink/45">Admin</span></span><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5edff] text-xs font-bold text-brand">{adminProfile.initials}</span></div></div></header>;
}
