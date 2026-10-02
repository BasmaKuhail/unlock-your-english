import Image from "next/image";

import { CheckIcon } from "@/components/ui/icons";
import { homeContent } from "@/content/home";

import { SectionEyebrow } from "./section-eyebrow";

type Skill = (typeof homeContent.programme.skills)[number];

const arcPositions = [
  "left-[1%] top-[15rem]",
  "left-[12%] top-[6rem]",
  "left-[29%] top-0",
  "right-[29%] top-0",
  "right-[12%] top-[6rem]",
  "right-[1%] top-[15rem]",
] as const;

export function ProgrammeSection() {
  const { programme } = homeContent;

  return (
    <section className="scroll-mt-8 py-20 sm:py-28" id="program">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>{programme.eyebrow}</SectionEyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-ink sm:text-5xl">
            {programme.title}
          </h2>
          <p className="mt-5 text-base leading-7 text-ink/60 sm:text-lg sm:leading-8">{programme.description}</p>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-brand/10 bg-brand/[0.045] px-4 py-3.5 text-left text-sm leading-6 text-ink/70 sm:mt-10 sm:px-5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
            <CheckIcon className="h-3 w-3" />
          </span>
          {programme.note}
        </div>

        <div className="relative mx-auto mt-10 min-h-[29rem] max-w-md overflow-hidden rounded-[2rem] bg-[#eff4ff] sm:min-h-[31rem] lg:mt-16 lg:hidden">
          <div aria-hidden="true" className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-white/90 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-brand/20 blur-3xl" />
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/2 h-[27.5rem] w-auto -translate-x-1/2 object-contain sm:h-[29rem]"
            height={1024}
            src="/cheeks.png"
            width={1024}
          />
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:hidden" role="list">
          {programme.skills.map((skill, index) => (
            <li className={index % 2 === 1 ? "mt-5" : ""} key={skill.number}>
              <SkillCard skill={skill} />
            </li>
          ))}
        </ul>

        <div className="relative mx-auto mt-16 hidden h-[37rem] max-w-6xl overflow-hidden rounded-[2.35rem] border border-brand/10 bg-[#f5f8ff] lg:block">
          <div aria-hidden="true" className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/90 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-brand/15 blur-3xl" />
          <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-80 w-[24rem] -translate-x-1/2 rounded-t-full bg-brand/[0.08] blur-2xl" />

          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1000 590">
            <path d="M86 316C140 112 306 32 500 32s360 80 414 284" stroke="currentColor" strokeDasharray="5 11" strokeLinecap="round" strokeWidth="2" className="text-brand/20" />
            <path d="M212 172C280 82 372 56 500 56s220 26 288 116" stroke="currentColor" strokeLinecap="round" strokeWidth="1" className="text-brand/10" />
          </svg>

          <ul className="absolute inset-0 z-20" role="list">
            {programme.skills.map((skill, index) => (
              <li className={`absolute w-48 ${arcPositions[index]}`} key={skill.number}>
                <SkillCard skill={skill} compact />
              </li>
            ))}
          </ul>

          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
            <Image
              alt=""
              className="absolute bottom-0 left-1/2 h-[34rem] w-auto -translate-x-1/2 object-contain drop-shadow-[0_22px_22px_rgba(1,14,54,0.14)]"
              height={1024}
              src="/cheeks.png"
              width={1024}
            />
          </div>

          <div aria-hidden="true" className="absolute bottom-8 left-1/2 z-0 h-4 w-40 -translate-x-1/2 rounded-full bg-ink/10 blur-sm" />
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill, compact = false }: { skill: Skill; compact?: boolean }) {
  return (
    <article
      className={`group rounded-[1.45rem] border border-white bg-white/95 shadow-[0_14px_30px_rgba(1,14,54,0.08)] transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_18px_38px_rgba(1,14,54,0.13)] ${
        compact ? "p-4" : "border-line p-5 sm:p-6"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-brand">{skill.number}</span>
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand/25 transition group-hover:bg-brand" />
      </div>
      <h3 className={`font-semibold tracking-[-0.04em] text-ink ${compact ? "mt-5 text-lg" : "mt-8 text-2xl"}`}>
        {skill.title}
      </h3>
      <p className={`text-ink/60 ${compact ? "mt-1.5 text-xs leading-5" : "mt-3 text-sm leading-6"}`}>{skill.description}</p>
    </article>
  );
}
