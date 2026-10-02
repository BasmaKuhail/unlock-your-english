import { CheckIcon } from "@/components/ui/icons";
import { homeContent } from "@/content/home";

import { SectionEyebrow } from "./section-eyebrow";

export function ApproachSection() {
  const { approach } = homeContent;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-white sm:px-10 sm:py-14 lg:grid lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16 lg:px-16">
          <div aria-hidden="true" className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand/30 blur-3xl" />
          <div className="relative z-10 max-w-md">
            <SectionEyebrow>{approach.eyebrow}</SectionEyebrow>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{approach.title}</h2>
          </div>
          <div className="relative z-10 mt-9 grid gap-5 lg:mt-0">
            {approach.points.map((point) => (
              <p className="flex gap-3 text-base leading-7 text-white/72 sm:text-lg sm:leading-8" key={point}>
                <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {point}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
