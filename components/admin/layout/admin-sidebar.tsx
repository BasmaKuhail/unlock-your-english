import Link from "next/link";

import { BookIcon, GridIcon, MoreIcon, UsersIcon } from "@/components/admin/icons";
import { adminNavigation, adminProfile } from "@/lib/admin/content";
import type { AdminView } from "@/lib/admin/types";
import { cn } from "@/lib/cn";

const navigationIcons = {
  book: BookIcon,
  grid: GridIcon,
  users: UsersIcon,
};

export function AdminSidebar({ view, onViewChange }: { view: AdminView; onViewChange: (view: AdminView) => void }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-[#e8eaf1] bg-white px-5 py-7 lg:flex">
      <div className="flex w-fit flex-col">
        <Link className="px-3 text-[1.8rem] font-black tracking-[-0.09em] text-ink" href="/">uye.</Link>
        <p className="mt-1 px-3 text-xs font-medium text-ink/45">Administration</p>
        <nav aria-label="Admin navigation" className="mt-10 space-y-1">
          {adminNavigation.map((item) => {
            const Icon = navigationIcons[item.icon];

            return <button className={cn("cursor-pointer flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition", view === item.value ? "bg-[#eaf0ff] text-brand" : "text-ink/55 hover:bg-[#f6f7fb] hover:text-ink")} key={item.value} onClick={() => onViewChange(item.value)} type="button"><Icon className="h-[19px] w-[19px]" />{item.label}</button>;
          })}
        </nav>
      </div>
      
      {/* <div className="mt-auto rounded-2xl bg-[#010e36] px-4 py-4 text-white">
        <p className="text-xs font-semibold text-white/55">Need a hand?</p>
        <p className="mt-1 text-sm font-semibold tracking-[-0.02em]">Uye support is here.</p>
        <button className="mt-3 text-xs font-bold text-[#a9c1ff] transition hover:text-white" type="button">
          Get help <span aria-hidden="true">→</span>
        </button>
      </div> */}
      <div className="mt-5 flex items-center gap-3 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5edff] text-xs font-bold text-brand">
          {adminProfile.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{adminProfile.name}</p>
          <p className="truncate text-xs text-ink/45">{adminProfile.role}</p>
        </div>
        <MoreIcon className="ml-auto h-4 w-4 text-ink/35" />
      </div>
    </aside>
  );
}
