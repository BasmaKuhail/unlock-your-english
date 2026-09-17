import { cn } from "@/lib/cn";
import type { StudentStatus } from "@/lib/admin/types";

export function StatusPill({ status }: { status: StudentStatus }) {
  const active = status === "Active";

  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", active ? "bg-[#e4f7ee] text-[#17734c]" : "bg-[#f1f2f6] text-[#697087]")}><span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-[#23a66d]" : "bg-[#8a91a5]")} />{status}</span>;
}
