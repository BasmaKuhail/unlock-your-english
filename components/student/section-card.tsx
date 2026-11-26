import { CheckIcon } from "@/components/ui/icons";
import type { LearningSection } from "@/lib/learner/types";

type SectionCardProps = {
  section: LearningSection;
  index: number;
  top: number;
  onOpen: () => void;
};

export function SectionCard({ section, index, top, onOpen }: SectionCardProps) {
  const locked = section.state === "locked";
  const completed = section.state === "completed";
  const left = index % 2 === 0;
  const status = locked ? "Locked" : completed ? "Completed" : "Ready to start";

  return (
    <li className="absolute left-0 w-full -translate-y-1/2" style={{ top }}>
      <button
        type="button"
        disabled={locked}
        onClick={onOpen}
        className="group grid min-h-32 w-full grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] items-center text-left focus-visible:rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand disabled:cursor-not-allowed sm:grid-cols-[minmax(0,1fr)_104px_minmax(0,1fr)]"
      >
        <span className="relative col-start-2 row-start-1 flex -translate-y-[34px] justify-center" aria-hidden="true">
          <svg className={`h-[76px] w-16 drop-shadow-[0_5px_6px_rgba(19,45,93,0.2)] transition-transform motion-reduce:transition-none ${locked ? "text-[#aebdcd]" : completed ? "text-[#2e9a88] group-hover:-translate-y-1" : "text-brand group-hover:-translate-y-1"}`} viewBox="0 0 48 58" fill="currentColor">
            <path d="M24 1C12 1 3 10 3 22c0 15 21 34 21 34s21-19 21-34C45 10 36 1 24 1Z" />
          </svg>
          <span className={`absolute top-[12px] flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-[#244a80] transition-transform motion-reduce:transition-none ${locked ? "" : "group-hover:-translate-y-1"}`}>
            {completed ? <CheckIcon className="h-5 w-5 text-[#218574]" /> : locked ? <svg className="h-5 w-5 text-[#7c8da0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg> : index + 1}
          </span>
        </span>
        <span className={`row-start-1 min-w-0 rounded-2xl border border-white/90 bg-white/95 px-3 py-3 shadow-[0_5px_20px_rgba(31,66,140,0.12)] transition-colors sm:px-5 sm:py-4 ${locked ? "" : "group-hover:border-[#a9c9ef]"} ${left ? "col-start-1 text-right" : "col-start-3"}`}>
          <span aria-hidden="true" className={`mb-1 block text-[10px] font-bold uppercase tracking-[0.12em] ${locked ? "text-[#718096]" : "text-[#4f78a8]"}`}>Lesson {index + 1}</span>
          <span className={`block break-words text-sm font-bold leading-snug sm:text-lg ${locked ? "text-[#64748b]" : "text-[#18345e] group-hover:text-brand"}`}>{section.title}</span>
          <span className="sr-only">, {status}</span>
        </span>
      </button>
    </li>
  );
}
