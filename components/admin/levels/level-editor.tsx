import { useState, type FormEvent } from "react";

import { CloseIcon, DocumentIcon, PlusIcon, UploadIcon } from "@/components/admin/icons";
import { Field } from "@/components/admin/ui/field";
import type { ContentSection, Level } from "@/lib/admin/types";

export function LevelEditor({ level, onClose, onSave }: { level: Level; onClose: () => void; onSave: (level: Level) => void }) {
  const [draft, setDraft] = useState(level);

  function addSection() {
    setDraft({ ...draft, sections: [...draft.sections, { id: Date.now(), title: "New content section", document: "" }] });
  }

  function updateSection(id: number, property: keyof Pick<ContentSection, "title" | "document">, value: string) {
    setDraft({ ...draft, sections: draft.sections.map((section) => section.id === id ? { ...section, [property]: value } : section) });
  }

  function removeSection(id: number) {
    setDraft({ ...draft, sections: draft.sections.filter((section) => section.id !== id) });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <div aria-modal="true" className="fixed inset-0 z-40 flex items-end bg-ink/25 backdrop-blur-[1px] sm:items-stretch sm:justify-end" role="dialog">
      <div className="flex max-h-[92dvh] w-full flex-col rounded-t-3xl bg-white shadow-2xl sm:h-full sm:max-h-none sm:max-w-2xl sm:rounded-none">
        <div className="flex items-start justify-between border-b border-[#e8eaf1] px-4 py-4 sm:px-6 sm:py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Learning content</p>
            <h2 className="mt-1 text-xl font-bold tracking-[-0.05em] sm:text-2xl">Manage level</h2>
          </div>
          <button aria-label="Close editor" className="rounded-full p-2 text-ink/45 hover:bg-[#f2f4f8]" onClick={onClose} type="button"><CloseIcon className="h-5 w-5" /></button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
          <div className="space-y-6 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
            <div className="grid gap-5 sm:grid-cols-[1fr_1.2fr]">
              <Field label="Level title"><input className="input" onChange={(event) => setDraft({ ...draft, title: event.target.value })} value={draft.title} /></Field>
              <Field label="Description"><input className="input" onChange={(event) => setDraft({ ...draft, description: event.target.value })} value={draft.description} /></Field>
            </div>
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-base font-bold">Content sections</h3>
                <p className="mt-1 text-xs text-ink/47">Add a title and document to each section.</p>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf0ff] px-3.5 py-2.5 text-xs font-bold text-brand hover:bg-[#dce7ff]" onClick={addSection} type="button"><PlusIcon className="h-3.5 w-3.5" />Add section</button>
            </div>

            <div className="space-y-3">
              {draft.sections.map((section, index) => (
                <div className="rounded-xl border border-[#e5e8ef] p-4" key={section.id}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-xs font-bold text-ink/50">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#edf1fb] text-[10px] text-brand">{index + 1}</span>
                      <span className="truncate">Section {index + 1}</span>
                    </span>
                    <button className="shrink-0 text-xs font-bold text-ink/37 hover:text-[#c14a4a]" onClick={() => removeSection(section.id)} type="button">Remove</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1.05fr_.95fr]">
                    <label>
                      <span className="mb-1.5 block text-xs font-semibold text-ink/57">Title</span>
                      <input className="input" onChange={(event) => updateSection(section.id, "title", event.target.value)} value={section.title} />
                    </label>
                    <label>
                      <span className="mb-1.5 block text-xs font-semibold text-ink/57">Document</span>
                      <div className="relative">
                        <DocumentIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink/40" />
                        <input className="input pl-9" onChange={(event) => updateSection(section.id, "document", event.target.value)} placeholder="Upload a document" value={section.document} />
                      </div>
                    </label>
                  </div>
                </div>
              ))}
              {draft.sections.length === 0 && (
                <button className="flex w-full flex-col items-center rounded-xl border border-dashed border-[#cfd7e7] bg-[#fbfcff] px-5 py-8 text-center hover:border-brand/50" onClick={addSection} type="button">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf0ff] text-brand"><UploadIcon className="h-4 w-4" /></span>
                  <span className="mt-3 text-sm font-bold">Add your first content section</span>
                  <span className="mt-1 text-xs text-ink/47">Include a clear title and learning document.</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-[#e8eaf1] px-4 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-5">
            <button className="w-full rounded-full px-4 py-3 text-sm font-bold text-ink/55 hover:bg-[#f2f4f8] sm:w-auto" onClick={onClose} type="button">Cancel</button>
            <button className="w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(58,112,255,0.22)] hover:bg-brand-dark sm:w-auto" type="submit">Save level</button>
          </div>
        </form>
      </div>
    </div>
  );
}
