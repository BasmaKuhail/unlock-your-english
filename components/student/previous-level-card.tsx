import { ArrowRightIcon } from "@/components/ui/icons";
import type { LearningLevel } from "@/lib/learner/types";

type PreviousLevelCardProps = {
  level: LearningLevel;
  index: number;
  onOpen: () => void;
};

export function PreviousLevelCard({ level, index, onOpen }: PreviousLevelCardProps) {
  const completed = level.sections.filter((section) => section.state === "completed").length;
  const total = level.sections.length;
  const percent = total ? Math.round(completed / total * 100) : 0;
  const scrollable = total > 2;

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[2rem] border border-[#e1eaf7] bg-white shadow-[0_12px_40px_rgba(31,66,140,0.05)] transition duration-200 hover:border-[#b8cff4] hover:shadow-[0_18px_45px_rgba(31,66,140,0.1)] focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 motion-reduce:transition-none">
      <button type="button" onClick={onOpen} aria-label={`Review ${level.title}`} className="absolute inset-0 z-10 rounded-[2rem] focus-visible:outline-none" />

      <div className="pointer-events-none relative flex items-center gap-4 overflow-hidden bg-[#eaf3ff] px-6 py-6 sm:px-7">
        <div aria-hidden="true" className="absolute -right-8 -top-14 h-32 w-32 rounded-full border-[22px] border-white/40" />
        <span aria-label={`Previous level ${index + 1}`} className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-bold text-brand shadow-[0_4px_12px_rgba(31,66,140,0.07)]">{String(index + 1).padStart(2, "0")}</span>
        <div className="relative min-w-0">
          <h3 className="mt-1 break-words text-xl font-bold tracking-tight text-[#17345e]">{level.title}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5 sm:px-7">
        <div className="pointer-events-none flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7185a3]">Lessons</p>
          {scrollable && <span className="text-xs font-medium text-[#7185a3]">Scroll to see all</span>}
        </div>
        {total ? (
          <ul aria-label={`Lessons in ${level.title}`} tabIndex={scrollable ? 0 : undefined} className={`mt-3 ${scrollable ? "relative z-20 max-h-[5.75rem] overflow-y-auto overscroll-contain pr-2 focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" : "pointer-events-none"}`}>
            {level.sections.map((lesson, lessonIndex) => (
              <li key={lesson.id} className="flex min-h-11 items-start gap-3 border-b border-[#eff3f9] py-3 text-sm font-medium leading-5 text-[#425a7d] last:border-0">
                <span aria-hidden="true" className="shrink-0 text-xs font-bold leading-5 text-[#9aafcd]">{String(lessonIndex + 1).padStart(2, "0")}</span>
                <span className="min-w-0 break-words">{lesson.title}</span>
              </li>
            ))}
          </ul>
        ) : <p className="pointer-events-none mt-4 text-sm text-ink/50">No lessons yet.</p>}

        <div className="pointer-events-none mt-auto pt-6">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold text-[#7185a3]"><span>{completed} of {total} lessons completed</span><span className="text-[#315a91]">{percent}%</span></div>
          <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eaf2ff]"><div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} /></div>
          <div aria-hidden="true" className="mt-5 flex items-center justify-between border-t border-[#eff3f9] pt-4 text-sm font-bold text-brand">
            <span>Review level</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf2ff] transition-colors group-hover:bg-brand group-hover:text-white"><ArrowRightIcon className="h-4 w-4" /></span>
          </div>
        </div>
      </div>
    </article>
  );
}
