"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";
import { ArrowRightIcon } from "@/components/ui/icons";
import { useStudentDashboard } from "@/hooks/use-student-dashboard";

import { LevelMap } from "./level-map";
import { PreviousLevels } from "./previous-levels";
import { ProgressBunny } from "./progress-bunny";
import { SectionReader } from "./section-reader";

export function StudentDashboard() {
  const dashboard = useStudentDashboard();
  const { data, loading, error, level, section, saving, notice } = dashboard;
  const [levelOpen, setLevelOpen] = useState(false);
  const handledContinue = useRef(false);
  const currentLevel = data?.levels.find((item) => item.isCurrent);
  const currentCompleted = currentLevel?.sections.filter((item) => item.state === "completed").length ?? 0;

  useEffect(() => {
    if (!data || handledContinue.current) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("continue") !== "1") return;
    handledContinue.current = true;
    url.searchParams.delete("continue");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    const current = data.levels.find((item) => item.isCurrent);
    const next = current?.sections.find((item) => item.state === "available");
    if (current && next) {
      dashboard.selectLevel(current.id);
      dashboard.selectSection(next.id);
      setLevelOpen(true);
    }
  }, [data, dashboard]);

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
          <LevelMap level={level} onOpenSection={dashboard.selectSection} />
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
            {currentLevel ? <>
              <h2 className="relative mt-4 max-w-[75%] text-3xl font-bold tracking-tight sm:text-4xl">{currentLevel.title}</h2>
              <div className="relative z-10 mt-auto max-w-[72%] pt-10">
                {currentLevel.sections.length ? <>
                  <div className="mb-3 flex justify-between gap-3 text-sm font-semibold"><span>Your progress</span><span>{Math.round(currentCompleted / currentLevel.sections.length * 100)}%</span></div>
                  <div role="progressbar" aria-label={`${currentLevel.title} progress`} aria-valuenow={Math.round(currentCompleted / currentLevel.sections.length * 100)} aria-valuemin={0} aria-valuemax={100} className="h-2.5 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-[#80d8ff]" style={{ width: `${currentCompleted / currentLevel.sections.length * 100}%` }} /></div>
                  <p className="mt-3 text-xs text-blue-100">{currentCompleted} of {currentLevel.sections.length} sections completed</p>
                  <button type="button" onClick={() => openLevel(currentLevel.id)} className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#173d91] transition hover:bg-blue-50">Open level <ArrowRightIcon className="h-4 w-4" /></button>
                </> : <>
                  <p className="text-base font-bold">Your lessons aren&apos;t here yet</p>
                  <p className="mt-2 text-sm leading-6 text-blue-100">There are no lessons in this level yet. Check back later or ask your teacher for an update.</p>
                </>}
              </div>
            </> : <p className="relative mt-5 text-sm text-blue-100">Your teacher will assign your level soon.</p>}
            {currentLevel && <ProgressBunny completed={currentCompleted} total={currentLevel.sections.length} className="pointer-events-none absolute -bottom-5 -right-8 h-[58%] w-[40%] object-contain object-bottom sm:-right-5 sm:h-[65%]" />}
          </section>
        </div>
        <PreviousLevels levels={data.levels} onOpenLevel={openLevel} />
      </>)}
    </main>
  </div>;
}
