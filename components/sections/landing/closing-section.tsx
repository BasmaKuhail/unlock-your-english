import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { homeContent } from "@/content/home";

export function ClosingSection() {
  const { closing, footer } = homeContent;

  return (
    <>
      <section className="border-y border-line bg-[#f6f8ff] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#eaf1ff] px-6 py-12 sm:px-10 sm:py-14 lg:flex lg:min-h-[24rem] lg:items-center lg:px-16">
            <div aria-hidden="true" className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/80 blur-3xl" />
            <div className="relative z-10 max-w-2xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-xl font-semibold text-white shadow-[0_12px_30px_rgba(58,112,255,0.22)]">
                +1
              </span>
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.06em] text-ink sm:text-5xl">
                {closing.title}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-ink/60 sm:text-lg sm:leading-8">
                {closing.description}
              </p>
              <Button className="mt-8" href={closing.action.href} rel="noreferrer" target="_blank">
                {closing.action.label}
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
            <Image
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -right-6 hidden h-[29rem] w-auto object-contain lg:block"
              height={1024}
              src="/wonder.png"
              width={1024}
            />
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <Logo label={homeContent.brand} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
          <p className="text-xs text-ink/45">{footer.copyright}</p>
          <nav aria-label="Footer navigation" className="flex gap-5">
            {footer.links.map((link) => (
              <a
                className="text-xs font-semibold text-ink/60 transition-colors hover:text-brand"
                href={link.href}
                key={link.label}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                target={link.href.startsWith("http") ? "_blank" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
