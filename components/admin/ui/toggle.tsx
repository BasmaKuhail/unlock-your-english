import { cn } from "@/lib/cn";

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button aria-label={label} aria-pressed={checked} className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-brand" : "bg-[#d9ddea]")} onClick={onChange} type="button"><span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform", checked ? "translate-x-6" : "translate-x-1")} /></button>;
}
