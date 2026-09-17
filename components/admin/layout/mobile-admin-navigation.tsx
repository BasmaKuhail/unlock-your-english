import { BookIcon, GridIcon, UsersIcon } from "@/components/admin/icons";
import { adminNavigation } from "@/lib/admin/content";
import type { AdminView } from "@/lib/admin/types";
import { cn } from "@/lib/cn";

const navigationIcons = {
  book: BookIcon,
  grid: GridIcon,
  users: UsersIcon,
};

export function MobileAdminNavigation({ view, onViewChange }: { view: AdminView; onViewChange: (view: AdminView) => void }) {
  return (
    <nav aria-label="Mobile admin navigation" className="fixed inset-x-2 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] z-30 flex rounded-2xl border border-[#e6e8ef] bg-white/95 p-1.5 shadow-[0_12px_30px_rgba(1,14,54,0.12)] backdrop-blur sm:inset-x-3 sm:bottom-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      {adminNavigation.map((item) => {
        const Icon = navigationIcons[item.icon];

        return (
          <button className={cn("flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold transition", view === item.value ? "bg-[#eaf0ff] text-brand" : "text-ink/45")} key={item.value} onClick={() => onViewChange(item.value)} type="button">
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
