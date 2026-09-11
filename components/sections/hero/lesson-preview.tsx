import { CheckIcon } from "@/components/ui/icons";
import { homeContent } from "@/content/home";

type LessonPreviewProps = {
  lesson: (typeof homeContent.hero)["lesson"];
};

export function LessonPreview({ lesson }: LessonPreviewProps) {
  return (
    <div className="rounded-[2rem] border border-line bg-white p-3 shadow-[0_30px_80px_rgba(1,14,54,0.13)] sm:p-4">
      <div className="overflow-hidden rounded-[1.45rem] bg-surface p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-ink/45">{lesson.label}</p>
            <h2 className="mt-1 text-xl font-bold tracking-[-0.04em] text-ink">
              {lesson.title}
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand shadow-sm">
            {lesson.progress}
          </span>
        </div>

        <div className="mt-6 flex gap-1.5" aria-label="Lesson progress">
          {[true, true, true, false, false].map((complete, index) => (
            <span
              className={`h-1.5 flex-1 rounded-full ${complete ? "bg-brand" : "bg-ink/10"}`}
              key={`${complete}-${index}`}
            />
          ))}
        </div>

        <div className="mt-7 rounded-2xl bg-white p-4 shadow-[0_12px_26px_rgba(1,14,54,0.06)] sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            Useful phrase
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.035em] text-ink sm:text-2xl">
            “{lesson.prompt}”
          </p>
          <div className="mt-4 rounded-xl bg-brand/[0.07] p-3.5 text-sm font-medium text-ink">
            <CheckIcon className="mr-2 inline-block h-5 w-5 rounded-full bg-brand p-1 text-white align-[-0.32rem]" />
            {lesson.response}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-ink p-4 text-white">
          <div>
            <p className="text-xs text-white/55">Daily progress</p>
            <p className="mt-1 text-sm font-semibold">You’re on a 4-day streak</p>
          </div>
          <span aria-hidden="true" className="animate-gentle-pulse text-lg">
            🔥
          </span>
        </div>
      </div>
    </div>
  );
}
