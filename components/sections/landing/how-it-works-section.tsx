import Image from "next/image";

import { CheckIcon } from "@/components/ui/icons";
import { homeContent } from "@/content/home";

import { SectionEyebrow } from "./section-eyebrow";

export function HowItWorksSection() {
  const { howItWorks } = homeContent;

  return (
    <section className="scroll-mt-8 border-y border-line bg-[#f8faff] py-20 sm:py-28" id="how-it-works">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{howItWorks.eyebrow}</SectionEyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-ink sm:text-5xl">
            {howItWorks.title}
          </h2>
          <p className="mt-5 text-base leading-7 text-ink/60 sm:text-lg sm:leading-8">
            {howItWorks.description}
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)] lg:items-stretch">
          <div className="relative isolate min-h-[25rem] overflow-hidden rounded-[2rem] bg-[#dfeaff] px-6 py-7 sm:min-h-[29rem] sm:px-9 sm:py-9">
            <div aria-hidden="true" className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/80 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-brand/20 blur-3xl" />

            <div className="relative z-10 inline-flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-3.5 py-3 shadow-[0_12px_28px_rgba(1,14,54,0.06)] backdrop-blur-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-xs font-bold text-white">
                5m
              </span>
              <span>
                <span className="block text-[0.68rem] font-bold uppercase tracking-[0.13em] text-brand">Your pace</span>
                <span className="mt-0.5 block text-sm font-semibold text-ink">One useful lesson</span>
              </span>
            </div>

            <div className="relative z-10 mt-8 max-w-[13.5rem] rounded-2xl bg-white/70 p-4 shadow-[0_10px_24px_rgba(1,14,54,0.04)] backdrop-blur-sm sm:p-5">
              <p className="text-2xl font-semibold leading-tight tracking-[-0.045em] text-ink sm:text-3xl">
                Small steps make space for big confidence.
              </p>
            </div>

            <Image
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -right-7 h-[29rem] w-auto object-contain sm:-bottom-24 sm:right-0 sm:h-[34rem]"
              height={1024}
              src="/wonder.png"
              width={1024}
            />
          </div>

          <div className="relative">
            <span aria-hidden="true" className="absolute bottom-12 left-7 top-12 hidden w-px bg-brand/15 sm:block" />
            <ol className="grid gap-3 sm:gap-4">
              {howItWorks.steps.map((step) => (
                <li className="relative" key={step.number}>
                  <article className="group flex h-full gap-4 rounded-[1.55rem] border border-line bg-white p-5 shadow-[0_10px_26px_rgba(1,14,54,0.035)] transition duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_16px_34px_rgba(1,14,54,0.08)] sm:gap-5 sm:p-6">
                    <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/[0.08] text-sm font-bold text-brand ring-8 ring-white">
                      {step.number}
                    </span>
                    <div className="py-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-brand/70">Step</span>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                          <CheckIcon className="h-2.5 w-2.5" />
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.04em] text-ink sm:text-2xl">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-ink/60 sm:text-[0.9375rem]">{step.description}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
