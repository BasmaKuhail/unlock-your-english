import Image from "next/image";
import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo";
import adminRabbit from "@/public/login.png";

type AdminLoginShellProps = {
  children: ReactNode;
};

export function AdminLoginShell({ children }: AdminLoginShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas px-4 py-4 sm:px-6 sm:py-6">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Logo label="uye." />
        <span className="rounded-full bg-[#eaf0ff] px-3 py-1.5 text-xs font-bold text-brand">Admin portal</span>
      </header>

      <main className="mx-auto my-auto grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[0_20px_55px_rgba(1,14,54,0.09)] lg:min-h-[32rem] lg:grid-cols-[0.88fr_1.12fr]">
        <aside className="relative hidden min-h-[32rem] overflow-hidden bg-[#eaf1ff] px-8 py-8 lg:flex lg:flex-col">
          <div aria-hidden="true" className="absolute -left-20 -top-16 h-48 w-48 rounded-full bg-brand/15 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-24 -right-12 h-56 w-56 rounded-full bg-white/75 blur-2xl" />

          <div className="relative max-w-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Control room</p>
            {/* <h2 className="mt-3 text-2xl font-bold tracking-[-0.05em] text-ink">Everything your learners need, in one place.</h2> */}
            {/* <p className="mt-3 text-sm leading-6 text-ink/60">Review learner progress and keep every level up to date.</p> */}
          </div>

          <div className="relative mt-auto flex min-h-0 flex-1 items-end justify-center pt-4">
            <Image
              alt="Uye’s administrator rabbit"
              className="relative z-10 h-[28rem] w-auto max-w-none object-contain"
              priority
              src={adminRabbit}
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
