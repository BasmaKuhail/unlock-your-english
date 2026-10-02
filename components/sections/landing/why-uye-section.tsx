import { CheckIcon } from "@/components/ui/icons";
import { homeContent } from "@/content/home";

import { SectionEyebrow } from "./section-eyebrow";

export function WhyUyeSection() {
  const { why } = homeContent;

  return (
    <section className="scroll-mt-8 border-y border-line bg-[#f8faff] py-20 sm:py-28" id="why-uye">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{why.eyebrow}</SectionEyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-ink sm:text-5xl">{why.title}</h2>
        </div>

        <ul className="mx-auto mt-12 grid max-w-5xl gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3" role="list">
          {why.reasons.map((reason, index) => (
            <li
              className={`flex items-start gap-3 rounded-2xl border border-line bg-white p-5 text-sm font-medium leading-6 text-ink/75 shadow-[0_8px_22px_rgba(1,14,54,0.025)] ${
                index === why.reasons.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
              key={reason}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <CheckIcon className="h-3 w-3" />
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
