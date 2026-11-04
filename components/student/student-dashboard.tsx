"use client";

import { useState } from "react";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";
import { ArrowRightIcon } from "@/components/ui/icons";
import { useStudentDashboard } from "@/hooks/use-student-dashboard";

import { SectionCard } from "./section-card";
import { SectionReader } from "./section-reader";

export function StudentDashboard() {
  const dashboard = useStudentDashboard();
  const { data, loading, error, level, section, saving, notice } = dashboard;
  const [levelOpen, setLevelOpen] = useState(false);
  const currentLevel = data?.levels.find((item) => item.isCurrent);
  const completed = level?.sections.filter((item) => item.state === "completed").length ?? 0;
  const total = level?.sections.length ?? 0;
  const currentCompleted = currentLevel?.sections.filter((item) => item.state === "completed").length ?? 0;

  function openLevel(id: string) {
    dashboard.selectLevel(id);
    setLevelOpen(true);
  }

  function goHome() {
    dashboard.selectSection(null);
    setLevelOpen(false);
  }

  return <div className="min-h-screen bg-[#f5f8ff]">
    <a href="#learning-content" className="sr-only z-50 rounded-lg bg-white p-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to learning content</a>
    <header className="border-b border-[#e9eef9] bg-white">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Logo label="UYE" />
        <div className="flex items-center gap-3 sm:gap-5">
          {data && <span className="hidden text-sm font-semibold text-ink/60 sm:block">{data.student.name}</span>}
          {data && <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf2ff] text-sm font-bold text-brand" aria-hidden="true">{data.student.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</span>}
          <button type="button" onClick={dashboard.logout} className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink/60 transition hover:bg-slate-50">Sign out</button>
        </div>
      </div>
    </header>

    <main id="learning-content" className="mx-auto max-w-[1240px] px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
      {error && <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800"><span>{error}</span><button type="button" onClick={dashboard.reload} className="font-semibold underline">Try again</button></div>}
      {notice && <p role="status" className="mb-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}
      {loading && !data ? <div role="status" aria-busy="true" className="rounded-[2rem] bg-white p-10 text-sm text-ink/60">Getting your learning space ready...</div> : data && (levelOpen && level ? <>
        {!section && <button type="button" onClick={goHome} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-dark"><span aria-hidden="true">←</span> My dashboard</button>}
        {section ? <SectionReader key={`${level.id}/${section.id}`} section={section} levelId={level.id} levelTitle={level.title} sectionNumber={level.sections.findIndex((item) => item.id === section.id) + 1} saving={saving} onComplete={dashboard.complete} onBack={() => dashboard.selectSection(null)} canComplete={level.isCurrent} /> : <>
          <div className="relative min-h-[220px] overflow-hidden rounded-[2rem] bg-[#dcecff] px-6 py-8 sm:min-h-[250px] sm:px-10 sm:py-10">
            <div aria-hidden="true" className="absolute -right-10 -top-24 h-72 w-72 rounded-full bg-white/40" />
            <div className="relative z-10 max-w-[62%] sm:max-w-[65%]">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">Your learning map</p>
              <h1 className="break-words text-3xl font-bold tracking-tight sm:text-4xl">{level.title}</h1>
              <p className="mt-3 text-sm leading-6 text-ink/60">Every section is a new stop on your learning adventure.</p>
              <span className="mt-5 inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-[#2457a7]">{completed} / {total} sections completed</span>
            </div>
            <Image src="/map.png" alt="" width={320} height={320} priority className="pointer-events-none absolute bottom-0 right-0 h-[76%] w-[36%] object-contain object-bottom mix-blend-multiply sm:right-5 sm:h-[92%] sm:w-[30%]" />
          </div>
          <section aria-label={`${level.title} sections`} className="relative mt-7 overflow-hidden rounded-[2rem] border border-[#e4edfc] bg-white px-4 py-10 shadow-[0_14px_50px_rgba(31,66,140,0.05)] sm:px-10 sm:py-14">
            <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-20 h-56 w-56 rounded-full bg-[#f2f7ff]" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-[#f3f8ff]" />
            <div className="relative mx-auto mb-10 flex max-w-[720px] items-end justify-between gap-3 border-b border-[#e8effb] pb-5">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Your path awaits</p><h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">Choose your next stop</h2><p className="mt-2 text-sm leading-6 text-ink/55">Follow the path and discover something new.</p></div>
              <Image src="/peeking.png" alt="" width={320} height={110} className="hidden w-40 shrink-0 object-contain sm:block" />
            </div>
            {total ? <ol className="relative mx-auto max-w-[720px]">{level.sections.map((item, index) => <SectionCard key={item.id} section={item} index={index} isLast={index === total - 1} onOpen={() => dashboard.selectSection(item.id)} />)}</ol> : <p className="relative py-10 text-center text-sm text-ink/55">Your sections will appear here soon.</p>}
          </section>
        </>}
      </> : <>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative min-h-[340px] overflow-hidden rounded-[2rem] bg-[#dcecff] px-7 pt-9 sm:min-h-[400px] sm:px-10 sm:pt-11">
            <div aria-hidden="true" className="absolute -right-16 -top-24 h-80 w-80 rounded-full bg-white/35" />
            <div className="relative z-10 max-w-[58%]"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand">Your learning space</p><h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">Welcome back,<br /><span className="text-brand">{data.student.name.split(/\s+/)[0]}!</span></h1><p className="mt-5 text-sm font-medium text-ink/60 sm:text-base">Ready for your next adventure?</p></div>
            <Image src="/waving-school.png" alt="" width={500} height={700} priority className="absolute -bottom-5 -right-3 h-[72%] w-[48%] object-contain object-bottom sm:-right-1 sm:h-[88%]" />
          </section>
          <section className="relative flex min-h-[340px] flex-col overflow-hidden rounded-[2rem] bg-[#173d91] p-7 text-white sm:min-h-[400px] sm:p-10">
            <div aria-hidden="true" className="absolute -right-14 -top-24 h-72 w-72 rounded-full border-[45px] border-white/5" />
            <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Current level</p>
            {currentLevel ? <><h2 className="relative mt-4 max-w-[75%] text-3xl font-bold tracking-tight sm:text-4xl">{currentLevel.title}</h2><div className="relative z-10 mt-auto max-w-[72%] pt-10"><div className="mb-3 flex justify-between gap-3 text-sm font-semibold"><span>Your progress</span><span>{currentLevel.sections.length ? Math.round(currentCompleted / currentLevel.sections.length * 100) : 0}%</span></div><div role="progressbar" aria-label={`${currentLevel.title} progress`} aria-valuenow={currentLevel.sections.length ? Math.round(currentCompleted / currentLevel.sections.length * 100) : 0} aria-valuemin={0} aria-valuemax={100} className="h-2.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-[#80d8ff]" style={{ width: `${currentLevel.sections.length ? currentCompleted / currentLevel.sections.length * 100 : 0}%` }} /></div><p className="mt-3 text-xs text-blue-100">{currentCompleted} of {currentLevel.sections.length} sections completed</p><button type="button" onClick={() => openLevel(currentLevel.id)} className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#173d91] transition hover:bg-blue-50">Open level <ArrowRightIcon className="h-4 w-4" /></button></div></> : <p className="relative mt-5 text-sm text-blue-100">Your teacher will assign your level soon.</p>}
            <Image src="/thumbsUp.png" alt="" width={400} height={400} className="pointer-events-none absolute -bottom-5 -right-8 h-[58%] w-[40%] object-contain object-bottom sm:-right-5 sm:h-[65%]" />
          </section>
        </div>
        {data.levels.some((item) => !item.isCurrent) && <section className="mt-10"><h2 className="mb-4 text-lg font-bold">Previous levels</h2><div className="flex flex-wrap gap-3">{data.levels.filter((item) => !item.isCurrent).map((past) => <button key={past.id} type="button" onClick={() => openLevel(past.id)} className="rounded-2xl border border-[#e4edfc] bg-white px-5 py-4 text-sm font-bold text-ink transition hover:border-brand/40 hover:text-brand">{past.title} <span aria-hidden="true" className="ml-4">→</span></button>)}</div></section>}
      </>)}
    </main>
  </div>;
}
