"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ProgressFeedback as ProgressFeedbackData } from "@/lib/learner/progress-feedback";

export function ProgressFeedback({ feedback, onDismiss, onRetry, onRefresh }: {
  feedback: ProgressFeedbackData;
  onDismiss: () => void;
  onRetry: () => void;
  onRefresh: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const isError = feedback.kind === "save-error" || feedback.kind === "refresh-error";
  const image = feedback.kind === "level-complete" ? "/images/bunny/wow.png" : isError ? "/images/bunny/surprised.png" : "/images/bunny/jump.png";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    actionRef.current?.focus();
  }, []);

  function dismiss() {
    dialogRef.current?.close();
  }

  return <dialog ref={dialogRef} onClose={() => { onDismiss(); if (document.activeElement === document.body) document.getElementById("learning-content")?.focus(); }} aria-labelledby="progress-feedback-title" aria-describedby="progress-feedback-message" className="m-auto w-[calc(100%-2rem)] max-w-md overflow-visible rounded-[2rem] border border-[#e4edfc] bg-white p-0 text-ink shadow-[0_24px_80px_rgba(1,14,54,0.22)] backdrop:bg-[#010e36]/55">
    <div className="relative overflow-hidden rounded-[2rem] px-6 pb-6 pt-5 text-center sm:px-8 sm:pb-8">
      <div aria-hidden="true" className="absolute left-1/2 top-[-5rem] h-56 w-56 -translate-x-1/2 rounded-full bg-[#e7f1ff]" />
      <button type="button" onClick={dismiss} aria-label="Close" className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-ink/50 transition hover:bg-[#eef5ff] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">✕</button>
      <Image src={image} alt="" width={220} height={220} className="relative mx-auto h-40 w-40 object-contain sm:h-44 sm:w-44" />
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">{isError ? "Your learning journey" : "A little celebration"}</p>
      <h2 id="progress-feedback-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{feedback.title}</h2>
      <p id="progress-feedback-message" className="mt-3 break-words text-sm leading-6 text-ink/65 [overflow-wrap:anywhere]">{feedback.message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button ref={actionRef} type="button" onClick={feedback.kind === "save-error" ? onRetry : feedback.kind === "refresh-error" ? onRefresh : dismiss} className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">{feedback.kind === "save-error" ? "Try again" : feedback.kind === "refresh-error" ? "Refresh dashboard" : "Continue"}</button>
        {isError && <button type="button" onClick={dismiss} className="rounded-full px-5 py-3 text-sm font-semibold text-ink/65 transition hover:bg-[#eef5ff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">Close</button>}
      </div>
    </div>
  </dialog>;
}
