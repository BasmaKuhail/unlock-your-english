import type { LearningLevel } from "@/lib/learner/types";
import { PreviousLevelCard } from "./previous-level-card";

type PreviousLevelsProps = {
  levels: LearningLevel[];
  onOpenLevel: (id: string) => void;
};

export function PreviousLevels({ levels, onOpenLevel }: PreviousLevelsProps) {
  const previousLevels = levels.filter((level) => !level.isCurrent);

  if (!previousLevels.length) return null;

  return (
    <section aria-labelledby="previous-levels-title" className="mt-10 sm:mt-12">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Your journey</p>
        <h2 id="previous-levels-title" className="mt-2 text-2xl font-bold tracking-tight text-ink">Previous levels</h2>
        <p className="mt-2 text-sm leading-6 text-ink/55">Revisit your lessons and see how far you&apos;ve come.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {previousLevels.map((level, index) => <PreviousLevelCard key={level.id} level={level} index={index} onOpen={() => onOpenLevel(level.id)} />)}
      </div>
    </section>
  );
}
