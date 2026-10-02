import { homeContent } from "@/content/home";

import { SectionEyebrow } from "./section-eyebrow";

export function TeamSection() {
  const { team } = homeContent;

  return (
    <section className="scroll-mt-8 py-20 sm:py-28" id="team">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{team.eyebrow}</SectionEyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-ink sm:text-5xl">{team.title}</h2>
        </div>

        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:mt-16" role="list">
          {team.members.map((member, index) => (
            <li className="rounded-[1.45rem] border border-line bg-white p-5 text-center shadow-[0_8px_22px_rgba(1,14,54,0.025)] sm:p-6" key={member}>
              <span
                aria-hidden="true"
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-base font-bold ${
                  index % 3 === 0
                    ? "bg-[#e2ecff] text-brand"
                    : index % 3 === 1
                      ? "bg-[#eef2ff] text-[#4a5b99]"
                      : "bg-[#e9f5ff] text-[#197fae]"
                }`}
              >
                {getInitials(member)}
              </span>
              <p className="mt-4 text-sm font-semibold leading-5 text-ink">{member}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}
