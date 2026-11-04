"use client";

import Image from "next/image";
import { useState } from "react";
import type { LevelResource } from "@/lib/admin/types";
import { learnerRequest } from "@/lib/learner/api";

function safeUrl(url: string) {
  try { const parsed = new URL(url); return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : null; } catch { return null; }
}

const resourceLabels: Record<LevelResource["type"], string> = {
  text: "Read & learn",
  link: "Explore a link",
  file: "Learning file",
  voice: "Listen & learn",
  image: "Look & learn",
};

export function ResourceView({ resource, levelId, sectionId, index }: { resource: LevelResource; levelId: string; sectionId: string; index: number }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function open() {
    setLoading(true); setError("");
    try {
      const result = await learnerRequest<{ url: string }>(`/api/learner/levels/${encodeURIComponent(levelId)}/sections/${encodeURIComponent(sectionId)}/resources/${encodeURIComponent(resource.id)}/access`);
      setUrl(result.url);
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to open this resource."); }
    finally { setLoading(false); }
  }
  const link = resource.type === "link" ? safeUrl(resource.url) : null;
  return <article className="rounded-[1.5rem] border border-[#e4edfc] bg-white p-5 shadow-[0_10px_35px_rgba(31,66,140,0.035)] sm:p-6">
    <div className="flex items-start gap-4">
      <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf4ff] text-sm font-bold text-brand">{String(index + 1).padStart(2, "0")}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">{resourceLabels[resource.type]}</p>
        <h3 className="mt-1 break-words text-lg font-bold leading-snug">{resource.title}</h3>
      </div>
    </div>
    <div className="mt-5 sm:ml-[60px]">
      {resource.type === "text" ? <p className="whitespace-pre-wrap break-words text-sm leading-7 text-ink/70">{resource.content}</p> : resource.type === "link" ? link ? <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-[#edf4ff] px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-[#dceaff]">Open learning link ↗ <span className="sr-only">(opens in a new tab)</span></a> : <p className="text-sm text-ink/60">This link is unavailable. Please let your teacher know.</p> : <>
        {!url ? <button type="button" disabled={loading} onClick={open} className="rounded-full bg-[#edf4ff] px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-[#dceaff] disabled:opacity-50">{loading ? "Opening…" : `Open ${resource.type === "voice" ? "audio" : resource.type}`}</button> : resource.type === "voice" ? <audio controls src={url} className="w-full" onError={() => { setUrl(null); setError("Audio unavailable. Try opening it again."); }} /> : resource.type === "image" ? <Image src={url} alt={resource.title} width={1000} height={750} unoptimized className="h-auto max-h-[600px] w-full rounded-2xl bg-[#f5f8ff] object-contain" onError={() => { setUrl(null); setError("Image unavailable. Try opening it again."); }} /> : <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-brand underline underline-offset-4">View file ↗ <span className="sr-only">(opens in a new tab)</span></a>}
        {url && <button type="button" disabled={loading} onClick={open} className="mt-3 block text-xs text-ink/60 underline">{loading ? "Refreshing…" : "Link expired? Refresh access"}</button>}
      </>}
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  </article>;
}
