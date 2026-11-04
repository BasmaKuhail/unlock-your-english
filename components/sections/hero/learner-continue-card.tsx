"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useHomeLanguage } from "@/context/home-language-context";
import { learnerRequest } from "@/lib/learner/api";
import type { LearnerDashboardData } from "@/lib/learner/types";

export function LearnerContinueCard() {
  const { isArabic } = useHomeLanguage();
  const [data, setData] = useState<LearnerDashboardData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    learnerRequest<LearnerDashboardData>("/api/learner/dashboard")
      .then((result) => { if (active) { setData(result); setStatus("ready"); } })
      .catch(() => { if (active) setStatus("error"); });
    return () => { active = false; };
  }, []);

  const level = data?.levels.find((item) => item.isCurrent);
  const section = level?.sections.find((item) => item.state === "available");
  const completed = level?.sections.filter((item) => item.state === "completed").length ?? 0;
  const total = level?.sections.length ?? 0;
  const allDone = total > 0 && completed === total;

  return <div className="rounded-[2rem] border border-line bg-white p-3 shadow-[0_30px_80px_rgba(1,14,54,0.13)] sm:p-4">
    <div className="relative overflow-hidden rounded-[1.45rem] bg-[#e7f1ff] p-6 sm:p-8">
      <div aria-hidden="true" className="absolute -end-12 -top-16 h-64 w-64 rounded-full bg-white/50" />
      <div className="relative z-10 max-w-[68%]">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">{isArabic ? "رحلتك التعليمية" : "Your learning journey"}</p>
        <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">{isArabic ? "لنواصل التعلّم!" : "Let’s keep learning!"}</h2>
        <p className="mt-3 text-sm leading-6 text-ink/60">{isArabic ? "خطوتك التالية في انتظارك." : "Your next step is waiting for you."}</p>
      </div>
      <Image src="/images/bunny/book.png" alt="" width={260} height={260} className="pointer-events-none absolute bottom-0 end-0 h-[150px] w-[34%] object-contain object-bottom sm:end-4 sm:h-[190px]" />
      <div className="relative z-10 mt-10 rounded-2xl bg-white p-5 shadow-[0_12px_26px_rgba(1,14,54,0.06)]" aria-live="polite">
        {status === "loading" ? <p className="text-sm text-ink/60">{isArabic ? "جارٍ تحميل رحلتك..." : "Getting your journey ready…"}</p> : <>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">{section ? (isArabic ? "قسمك الحالي" : "Your current section") : (isArabic ? "مساحتك التعليمية" : "Your learning space")}</p>
          <h3 className="mt-2 break-words text-xl font-bold text-ink">{section?.title ?? (allDone ? (isArabic ? "أحسنت! أكملت المستوى" : "You’ve completed your level!") : (isArabic ? "رحلتك التعليمية" : "Your learning journey"))}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/60">{section && level ? level.title : status === "error" ? (isArabic ? "يمكنك متابعة رحلتك من لوحة التعلّم." : "Visit your dashboard to continue your journey.") : allDone ? (isArabic ? "يمكنك مراجعة أقسامك في أي وقت." : "Visit your dashboard to revisit your sections.") : (isArabic ? "ستظهر أقسامك هنا عندما تصبح جاهزة." : "Your sections will appear when they’re ready.")}</p>
          <Link href={section ? "/dashboard?continue=1" : "/dashboard"} className="mt-5 inline-flex items-center gap-3 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">{section ? (isArabic ? "تابع التعلّم" : "Continue learning") : (isArabic ? "اذهب إلى لوحة التعلّم" : "Go to dashboard")} <span aria-hidden="true">{isArabic ? "←" : "→"}</span></Link>
        </>}
      </div>
      {level && total > 0 && <p className="relative mt-4 text-xs font-semibold text-ink/55">{isArabic ? `${completed} من ${total} أقسام مكتملة` : `${completed} of ${total} sections completed`}</p>}
    </div>
  </div>;
}
