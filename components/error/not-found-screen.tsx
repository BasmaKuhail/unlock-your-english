import Image from "next/image";

import { Button } from "@/components/ui/button";
import map from "@/public/map.png";

export function NotFoundScreen() {
  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-[#fbfdff] px-4 py-6 sm:px-8 sm:py-10">
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-36 -z-10 h-[32rem] w-[32rem] rounded-full bg-[#dce9ff] blur-3xl sm:-right-16"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-48 -left-36 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#d8f4ff]/70 blur-3xl"
      />

      <section className="relative mx-auto grid min-h-[calc(100dvh-3rem)] w-full max-w-6xl items-center lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <div className="relative order-1 mx-auto h-80 w-full max-w-[27rem] sm:h-[28rem] sm:max-w-[34rem] lg:col-start-2 lg:row-start-1 lg:-translate-x-10 lg:h-[min(44vw,37rem)] lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-x-[5%] inset-y-[8%] rounded-[46%] bg-brand/[0.07]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-[12%] inset-y-[14%] rounded-[44%] border border-brand/[0.12]"
          />
          <p
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(10rem,29vw,20rem)] font-black leading-none tracking-[-0.13em] text-brand/[0.12]"
          >
            404
          </p>
          <Image
            alt="The Uye rabbit looking at a map"
            className="relative z-10 h-full w-full object-contain mix-blend-multiply"
            priority
            sizes="(min-width: 1024px) 52vw, (min-width: 640px) 34rem, 100vw"
            src={map}
          />
        </div>

        <div className="relative z-20 order-2 mx-auto -mt-12 w-full max-w-md rounded-[1.75rem] border border-white bg-white/90 p-6 shadow-[0_24px_60px_rgba(31,78,151,0.16)] backdrop-blur sm:-mt-16 sm:p-9 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:max-w-[27rem] lg:translate-x-16 xl:translate-x-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand/[0.08] px-3 py-1.5 text-xs font-bold tracking-[0.08em] text-brand">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
            404 · ROUTE UNAVAILABLE
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.07em] text-ink sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-4 max-w-sm text-base font-medium leading-7 text-ink/60 sm:text-lg sm:leading-8">
            The page you are looking for is not here. Let&apos;s get you back on track.
          </p>
          <Button className="mt-7 w-full rounded-xl px-6 py-3.5 sm:w-auto" href="/">
            Back home
          </Button>
        </div>
      </section>
    </main>
  );
}
