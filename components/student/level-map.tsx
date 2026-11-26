import type { LearningLevel } from "@/lib/learner/types";
import { ProgressBunny } from "./progress-bunny";
import { SectionCard } from "./section-card";

type LevelMapProps = {
  level: LearningLevel;
  onOpenSection: (id: string) => void;
};

export function LevelMap({ level, onOpenSection }: LevelMapProps) {
  const total = level.sections.length;
  const completed = level.sections.filter((section) => section.state === "completed").length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  // These positions follow the five long, horizontal stretches in road.png.
  const roadStops = [134, 306, 478, 653, 826];
  const roadHeight = total ? Math.floor((total - 1) / roadStops.length) * 1000 + roadStops[(total - 1) % roadStops.length] + 100 : 0;

  return (
    <section aria-labelledby="level-map-title" className="overflow-hidden rounded-[2rem] border border-[#e1eaf7] bg-white shadow-[0_18px_60px_rgba(31,66,140,0.06)]">
      <div className="relative overflow-hidden border-b border-[#e6eef9] bg-[#f0f6ff] px-6 py-8 sm:px-10 sm:py-10">
        <div aria-hidden="true" className="absolute -right-16 -top-28 h-64 w-64 rounded-full bg-white/60" />
        <div className="relative z-10 max-w-[68%] sm:max-w-[72%]">
          <h1 id="level-map-title" className="mt-3 break-words text-3xl font-bold tracking-tight text-[#17345e] sm:text-4xl">{level.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold text-[#315a91]">
            <span>{completed} of {total} lessons completed</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#9bb3d2]" />
            <span>{percent}% complete</span>
          </div>
          <div role="progressbar" aria-label={`${level.title} progress`} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-2 max-w-64 overflow-hidden rounded-full bg-[#d6e5f8]">
            <div className="h-full rounded-full bg-brand transition-[width] motion-reduce:transition-none" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <ProgressBunny completed={completed} total={total} className="pointer-events-none absolute bottom-0 right-1 h-[75%] w-[30%] object-contain object-bottom sm:right-6 sm:h-[90%] sm:w-[25%]" />
      </div>

      <div className="bg-[#d5f3d3] bg-cover bg-top bg-no-repeat px-5 py-8 sm:px-10 sm:py-10" style={{ backgroundImage: "url('/images/background.png')" }}>
        <div className="mx-auto max-w-[720px]">
          <h2 className="mt-2 text-xl font-bold tracking-tight text-[#17345e] sm:text-2xl">Choose a lesson</h2>
          <p className="mt-2 text-sm leading-6 text-[#667b96]">Complete each lesson to unlock the next stop.</p>
        </div>
        {total ? (
          <div className="relative mx-auto mt-6 max-w-[720px] overflow-hidden" style={{ height: roadHeight }}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: "url('/images/road.png')", backgroundSize: "100% 1000px", backgroundRepeat: "repeat-y" }} />
            <ol className="relative h-full">
              {level.sections.map((section, index) => <SectionCard key={section.id} section={section} index={index} top={Math.floor(index / roadStops.length) * 1000 + roadStops[index % roadStops.length]} onOpen={() => onOpenSection(section.id)} />)}
            </ol>
          </div>
        ) : <p className="py-12 text-center text-sm text-[#667b96]">Your lessons will appear here soon.</p>}
      </div>
    </section>
  );
}
