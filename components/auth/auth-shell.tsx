import Image from "next/image";
import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo";
import { loginContent } from "@/content/auth";
import rabbitReading from "@/public/jump.png";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  const { visual } = loginContent;

  return (
    <div className="flex min-h-dvh flex-col bg-canvas px-4 py-4 sm:px-6 sm:py-6">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Logo label="uye." />
      </header>

      <main className="mx-auto my-auto grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[0_20px_55px_rgba(1,14,54,0.09)] lg:min-h-[32rem] lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="relative hidden min-h-[32rem] overflow-hidden bg-[#eaf1ff] px-8 py-8 lg:flex lg:flex-col">
          <div aria-hidden="true" className="absolute -left-20 -top-16 h-48 w-48 rounded-full bg-brand/15 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-24 -right-12 h-56 w-56 rounded-full bg-white/75 blur-2xl" />

          <div className="relative max-w-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
              {visual.eyebrow}
            </p>
          </div>

          <div className="relative mt-auto flex min-h-0 flex-1 items-end justify-center pt-4">
            <div className="absolute inset-x-0 bottom-0 h-full rounded-[1.5rem] " />
            <Image
              alt="The Uye rabbit reading a book"
              className="relative z-10 w-[23rem] max-w-none -rotate-6 object-contain"
              priority
              src={rabbitReading}
            />
          </div>
        </aside>

        <section className="flex items-center px-5 py-9 sm:px-10 sm:py-10 lg:px-12">
          <div className="mx-auto w-full max-w-sm">{children}</div>
        </section>
      </main>
    </div>
  );
}
