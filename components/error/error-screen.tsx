import Image from "next/image";

import { Button } from "@/components/ui/button";
import bodyGuard from "@/public/body-gard.png";

type ErrorScreenProps = {
  code: string;
  label: string;
  message: string;
  actionLabel: string;
  actionHref: string;
};

export function ErrorScreen({
  code,
  label,
  message,
  actionLabel,
  actionHref,
}: ErrorScreenProps) {
  return (
    <main className="flex min-h-dvh items-center overflow-hidden bg-white px-5 py-10 sm:px-8">
      <section className="mx-auto grid w-full max-w-6xl items-center gap-4 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">
        <div className="relative z-20 mx-auto w-full max-w-sm lg:mx-0">
          <h1 className="text-[clamp(8rem,18vw,13rem)] font-black leading-[0.74] tracking-[-0.1em] text-brand">
            {code}
          </h1>
          <p className="mt-5 text-3xl font-black tracking-[-0.06em] text-ink sm:text-4xl">{label}</p>
          <p className="mt-5 max-w-xs text-base font-medium leading-7 text-ink/60">{message}</p>
          <Button
            className="mt-7 rounded-xl px-6 py-3.5"
            href={actionHref}
          >
            {actionLabel}
          </Button>
        </div>

        <div className="relative mx-auto h-[27rem] w-full max-w-2xl sm:h-[31rem] lg:h-[35rem]">
          <Image
            alt="The Uye rabbit in a security guard uniform"
            className="absolute bottom-9 left-1/2 z-10 h-[24rem] w-auto max-w-none -translate-x-1/2 mix-blend-multiply sm:h-[29rem] lg:h-[33rem]"
            priority
            src={bodyGuard}
          />

          <div aria-hidden="true" className="absolute inset-x-[8%] bottom-5 z-20 h-28">
            <div className="absolute bottom-0 left-0 h-24 w-4 rounded-t-full bg-[#8edcff] shadow-[inset_-2px_0_0_rgba(61,114,251,0.18)]" />
            <div className="absolute bottom-0 right-0 h-24 w-4 rounded-t-full bg-[#8edcff] shadow-[inset_-2px_0_0_rgba(61,114,251,0.18)]" />
            <div className="absolute bottom-[5.25rem] left-2 right-2 h-16 rounded-b-[50%] border-b-[5px] border-brand" />
            <div className="absolute bottom-0 -left-4 h-5 w-12 rounded-t-full bg-[#8edcff]" />
            <div className="absolute bottom-0 -right-4 h-5 w-12 rounded-t-full bg-[#8edcff]" />
          </div>
        </div>
      </section>
    </main>
  );
}
