import { LessonPreview } from "@/components/sections/hero/lesson-preview";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { homeContent } from "@/content/home";

export function HeroSection() {
  const { hero } = homeContent;

  return (
    <section className="relative isolate mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-14 lg:px-10 lg:pb-28 lg:pt-20">
      <div
        aria-hidden="true"
        className="absolute -right-40 top-0 -z-10 h-[34rem] w-[34rem] rounded-full bg-brand/[0.07] blur-3xl sm:-right-24 lg:-right-12"
      />
      <div
        aria-hidden="true"
        className="absolute left-[45%] top-40 -z-10 h-60 w-60 rounded-full bg-[#dce7ff] blur-3xl"
      />

      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.86fr)] lg:gap-20">
        <div className="max-w-2xl">
          <p className="animate-hero-enter inline-flex items-center gap-2 rounded-full border border-brand/10 bg-brand/[0.06] px-3.5 py-2 text-xs font-semibold tracking-[0.015em] text-brand [animation-delay:70ms]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {hero.eyebrow}
          </p>

          <h1 className="animate-hero-enter mt-6 max-w-xl text-5xl font-semibold tracking-[-0.065em] text-ink [animation-delay:140ms] sm:text-6xl sm:leading-[1.03] lg:text-7xl">
            {hero.title}
          </h1>

          <p className="animate-hero-enter mt-6 max-w-lg text-base leading-7 text-ink/65 [animation-delay:220ms] sm:text-lg sm:leading-8">
            {hero.description}
          </p>

          <div className="animate-hero-enter mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 [animation-delay:300ms]">
            <Button href={hero.primaryAction.href}>
              {hero.primaryAction.label}
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button href={hero.secondaryAction.href} variant="text">
              {hero.secondaryAction.label}
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>

          <div className="animate-hero-enter mt-10 flex items-center gap-3 [animation-delay:370ms]">
            <div aria-hidden="true" className="flex -space-x-2">
              {[
                "bg-[#ffceb6] text-[#a34118]",
                "bg-[#c7dcff] text-[#31589e]",
                "bg-[#d9d3ff] text-[#58459f]",
              ].map((color, index) => (
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold ${color}`}
                  key={color}
                >
                  {String.fromCharCode(65 + index)}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium text-ink/60">{hero.socialProof}</p>
          </div>
        </div>

        <div className="animate-hero-enter relative mx-auto w-full max-w-[32rem] [animation-delay:220ms] lg:mx-0">
          <div
            aria-hidden="true"
            className="animate-drift absolute -right-2 -top-6 hidden rounded-2xl bg-ink px-4 py-3 text-xs font-semibold text-white shadow-xl sm:block"
          >
            One step closer
            <span className="ml-2 text-[#9fbbff]">✦</span>
          </div>

          <LessonPreview lesson={hero.lesson} />

          <div
            aria-hidden="true"
            className="absolute -bottom-7 -left-4 flex items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_18px_36px_rgba(1,14,54,0.12)] sm:-left-9"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e5eeff] text-brand">
              <CheckIcon className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold text-ink">Lesson complete!</span>
          </div>
        </div>
      </div>
    </section>
  );
}
