import type { ReactNode } from "react";

export function PageHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-5">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold tracking-[-0.055em] text-ink sm:text-[2.1rem]">{title}</h1>
      </div>
      {children}
    </div>
  );
}
