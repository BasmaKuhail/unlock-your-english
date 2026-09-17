import Image from "next/image";

import { homeContent } from "@/content/home";

import { SectionEyebrow } from "./section-eyebrow";

export function AboutSection() {
  const { about } = homeContent;

  return (
    <section className="scroll-mt-8 py-16 sm:py-24" id="about">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-20 lg:px-10">
        <div className="max-w-2xl">
          <SectionEyebrow>{about.eyebrow}</SectionEyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-ink sm:text-5xl">{about.title}</h2>
          <p className="mt-5 text-base leading-7 text-ink/60 sm:text-lg sm:leading-8">{about.description}</p>
          <div className="mt-8 rounded-[1.5rem] border border-brand/10 bg-[#f3f7ff] p-6 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{about.mission.title}</p>
            <p className="mt-3 text-lg font-medium leading-8 tracking-[-0.02em] text-ink">{about.mission.description}</p>
          </div>
        </div>

        <div aria-hidden="true" className="relative hidden h-[29rem] overflow-hidden rounded-[2rem] bg-[#eaf1ff] lg:block">
          <div className="absolute -left-16 top-4 h-52 w-52 rounded-full bg-white/85 blur-3xl" />
          <Image
            alt=""
            className="absolute -bottom-9 left-1/2 h-[30rem] w-auto -translate-x-1/2 object-contain"
            height={1024}
            src="/school.png"
            width={1024}
          />
        </div>
      </div>
    </section>
  );
}
