import { CheckIcon } from "@/components/ui/icons";
import type { LearningSection } from "@/lib/learner/types";

export function SectionCard({ section, index, isLast, onOpen }: { section: LearningSection; index: number; isLast: boolean; onOpen: () => void }) {
  const locked = section.state === "locked";
  const completed = section.state === "completed";
  const left = index % 2 === 0;

  return <li className="relative">
    <div className={`relative flex ${left ? "justify-start" : "justify-end"}`}>
      <button type="button" disabled={locked} onClick={onOpen} className={`group relative z-10 flex w-[48%] flex-col items-center rounded-[1.75rem] border px-3 py-5 text-center transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:px-6 sm:py-7 ${locked ? "cursor-not-allowed border-[#e7e9ed] bg-[#f2f3f5] text-[#9299a6]" : completed ? "border-[#dce8fb] bg-[#eff6ff] text-[#17448f] hover:-translate-y-1 hover:shadow-lg" : "border-brand bg-brand text-white shadow-[0_10px_25px_rgba(61,114,251,0.25)] hover:-translate-y-1 hover:bg-brand-dark"}`}>
        <span className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold sm:h-14 sm:w-14 ${locked ? "bg-[#e4e6e9]" : completed ? "bg-white text-brand" : "bg-white/20"}`}>
          {completed ? <CheckIcon className="h-6 w-6" /> : locked ? <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg> : String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-70">Section {String(index + 1).padStart(2, "0")}</span>
        <span className="mt-1 text-sm font-bold leading-snug sm:text-base">{section.title}</span>
        <span className="mt-2 text-xs font-medium opacity-70">{locked ? "Locked" : completed ? "Completed" : "Start section →"}</span>
      </button>
    </div>
    {!isLast && <svg aria-hidden="true" className="relative -my-1 h-16 w-full sm:h-20" viewBox="0 0 100 100" preserveAspectRatio="none"><path d={left ? "M24 0 C24 50 76 50 76 100" : "M76 0 C76 50 24 50 24 100"} fill="none" stroke={locked ? "#dce0e7" : "#b8cffa"} strokeWidth="2" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" /></svg>}
  </li>;
}
