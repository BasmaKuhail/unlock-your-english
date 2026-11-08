"use client";

import Image from "next/image";
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

  return <div className="mx-auto w-full max-w-[32rem]" aria-live="polite">
    <div className="relative aspect-square w-full">
      <div className="absolute bottom-[5%] left-0 z-30 flex w-[46%] flex-col-reverse gap-2 sm:contents">
        {<>
          {/* <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand">{isArabic ? "رحلتك التعليمية" : "Your learning journey"}</p> */}
          {level && <div className="flex min-w-0 flex-col items-center rounded-2xl border border-white/70 bg-white/70 px-3 py-2 shadow-[0_12px_32px_rgba(1,14,54,0.12)] backdrop-blur-sm sm:absolute sm:bottom-15 sm:left-0 sm:z-30 sm:w-[30%] sm:px-5 sm:py-4">

          
            <p className="mt-2 break-words text-sm font-semibold text-ink/60 [overflow-wrap:anywhere]">
              {isArabic ? "المستوى الحالي: " : "Current level: "}
              <span className="text-ink">{level.title}</span>
            </p>
          </div>}
            <div className="flex min-w-0 flex-col items-center rounded-2xl border border-white/70 bg-white/70 px-3 py-2 shadow-[0_12px_32px_rgba(1,14,54,0.12)] backdrop-blur-sm sm:absolute sm:left-0 sm:top-[50%] sm:z-30 sm:w-[35%] sm:px-5 sm:py-4 lg:-left-15 lg:top-65">

          <p className="mt-1 break-words text-sm font-bold text-ink [overflow-wrap:anywhere] sm:text-base">
            {status === "loading" ? (isArabic ? "جارٍ تحميل رحلتك..." : "Getting your journey ready…") : section ? 
              <>
                {isArabic ? "القسم الحالي: " : "Current section: "}
                {section.title}
              </> : allDone ? (isArabic ? "أحسنت! أكملت المستوى" : "You’ve completed your level!") : status === "error" ? (isArabic ? "يمكنك متابعة رحلتك من لوحة التعلّم." : "Visit your dashboard to continue your journey.") : (isArabic ? "ستظهر أقسامك هنا." : "Your sections will appear here.")}</p>
        </div>
        </>}
      </div>
      <div aria-hidden="true" className="absolute left-1/2 top-[9.5%] aspect-square w-[84%] -translate-x-1/2 rounded-full border-2 border-dashed border-brand/50 p-2 sm:p-3">
        <div className="h-full w-full rounded-full bg-gradient-to-br from-[#4b83ff] to-[#173d91]" />
      </div>

      <Image src="/images/bunny/confident.png" alt="" width={1280} height={1280} priority className="pointer-events-none absolute left-1/2 top-[6.5%] z-10 h-[90%] w-[94%] -translate-x-1/2 object-contain" />

      <div aria-hidden="true" className="absolute inset-0 z-20 text-brand">
        <span className="absolute left-[11%] top-[17%] flex h-12 w-12 rotate-[-12deg] items-center justify-center rounded-full border-4 border-white bg-[#dcecff] shadow-lg sm:h-16 sm:w-16">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 sm:h-7 sm:w-7"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21z" /></svg>
        </span>
        <span className="absolute left-[42%] top-[1%] flex h-12 w-12 rotate-[10deg] items-center justify-center rounded-full border-4 border-white bg-[#dcecff] shadow-lg sm:h-16 sm:w-16">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 sm:h-7 sm:w-7"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z" /></svg>
        </span>
        <span className="absolute right-[10%] top-[17%] flex h-12 w-12 rotate-[12deg] items-center justify-center rounded-full border-4 border-white bg-[#dcecff] shadow-lg sm:h-16 sm:w-16">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 sm:h-7 sm:w-7"><path d="M9 18h6M10 21h4M8.5 14.5a6 6 0 1 1 7 0c-.9.6-1.5 1.4-1.5 2.5h-4c0-1.1-.6-1.9-1.5-2.5z" /></svg>
        </span>
        <span className="absolute left-[4%] top-[53%] h-3 w-3 rounded-full bg-brand/60" />
        <span className="absolute right-[4%] top-[57%] h-2.5 w-2.5 rounded-full bg-[#36b3e5]" />
        <span className="absolute bottom-[5%] left-[14%] h-2 w-2 rounded-full bg-[#36b3e5]" />
      </div>

      {/* {level && total > 0 && <p className="absolute bottom-[29%] right-0 z-20 rounded-full bg-ink px-3 py-2 text-xs font-bold text-white shadow-lg sm:px-4">
        {isArabic ? `${completed} من ${total} أقسام مكتملة` : `${completed} / ${total} sections completed`}
      </p>} */}
    </div>

  </div>;
}
