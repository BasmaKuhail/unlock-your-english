import Image from "next/image";
import { useEffect, useRef } from "react";
import type { LearningSection } from "@/lib/learner/types";
import { ResourceView } from "./resource-view";

export function SectionReader({ section, levelId, levelTitle, sectionNumber, saving, onComplete, onBack, canComplete }: { section: LearningSection; levelId: string; levelTitle: string; sectionNumber: number; saving: boolean; onComplete: () => void; onBack: () => void; canComplete: boolean }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, [section.id]);
  const completed = section.state === "completed";
  const resourceCount = section.resources.length;

  return <section aria-labelledby="section-heading">
    <button type="button" onClick={onBack} disabled={saving} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-brand transition hover:text-brand-dark disabled:opacity-50"><span aria-hidden="true">←</span> Back to learning map</button>

    <div className="relative overflow-hidden rounded-[2rem] bg-[#dcecff] px-6 pt-8 sm:px-10 sm:pt-10">
      <div aria-hidden="true" className="absolute -right-16 -top-28 h-80 w-80 rounded-full bg-white/35" />
      <div aria-hidden="true" className="absolute bottom-0 right-[28%] h-28 w-28 rounded-full bg-[#c8e2ff]/70" />
      <div className="relative z-10 max-w-[70%] pb-10 sm:max-w-[65%] sm:pb-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand sm:text-xs">{levelTitle} <span className="px-1.5 text-brand/40">/</span> Section {String(sectionNumber).padStart(2, "0")}</p>
        <h1 ref={headingRef} tabIndex={-1} id="section-heading" className="mt-4 break-words text-3xl font-bold leading-tight tracking-tight outline-none sm:text-5xl">{section.title}</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-ink/65 sm:text-base">Every little step takes you further. Let’s learn something new together!</p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-bold text-[#2457a7]"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#46b7ed]" />{completed ? "Section completed" : `${resourceCount} ${resourceCount === 1 ? "learning resource" : "learning resources"}`}</span>
      </div>
      <Image src="/images/bunny/book.png" alt="" width={400} height={400} priority className="pointer-events-none absolute bottom-0 right-0 h-[55%] w-[32%] object-contain object-bottom sm:right-8 sm:h-[90%] sm:w-[30%]" />
    </div>

    <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
      <div>
        <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Your learning journey</p><h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Let’s learn together</h2><p className="mt-2 text-sm leading-6 text-ink/55">Take your time and explore each activity below.</p></div><span className="hidden shrink-0 rounded-full bg-[#eaf2ff] px-3 py-1.5 text-xs font-bold text-brand sm:block">{resourceCount} {resourceCount === 1 ? "resource" : "resources"}</span></div>
        <div className="space-y-4">
          {section.resources.map((resource, index) => <ResourceView key={resource.id} resource={resource} levelId={levelId} sectionId={section.id} index={index} />)}
          {!resourceCount && <div className="rounded-[1.5rem] border border-[#e4edfc] bg-white p-7"><h3 className="font-bold">Something new is on its way!</h3><p className="mt-2 text-sm leading-6 text-ink/60">Your teacher is preparing resources for this section. Check back soon.</p></div>}
        </div>
      </div>
      <aside className="h-fit overflow-hidden rounded-[1.75rem] border border-[#e4edfc] bg-white shadow-[0_14px_50px_rgba(31,66,140,0.04)]">
        <div className="relative min-h-[175px] overflow-hidden bg-[#eef5ff] px-6 pt-6">
          <div aria-hidden="true" className="absolute -right-7 -top-10 h-40 w-40 rounded-full bg-white/60" />
          <p className="relative z-10 max-w-[48%] text-xs font-bold uppercase leading-5 tracking-[0.14em] text-brand">A little progress every day ✦</p>
          <Image src="/images/bunny/pointing.png" alt="" width={220} height={220} className="absolute -bottom-7 right-2 h-[185px] w-[155px] object-contain object-bottom" />
        </div>
        <div className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">You’ve got this</p>
          <h2 className="mt-2 text-xl font-bold">One step at a time</h2>
          <p className="mt-3 text-sm leading-6 text-ink/60">Explore each resource at your own pace. When you’re ready, complete this section to continue your journey.</p>
          {completed ? <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-800">✓ You’ve completed this section. Come back anytime to practise.</p> : canComplete ? <button type="button" disabled={saving || !resourceCount} onClick={onComplete} className="mt-5 w-full rounded-full bg-brand px-5 py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Saving progress…" : "Mark as complete  ✓"}</button> : null}
        </div>
      </aside>
    </div>
  </section>;
}
