import { useState, type FormEvent } from "react";

import { CloseIcon } from "@/components/admin/icons";
import { Field } from "@/components/admin/ui/field";
import { Toggle } from "@/components/admin/ui/toggle";
import type { Level, Student } from "@/lib/admin/types";
import { cn } from "@/lib/cn";

export function StudentEditor({ student, levels, onClose, onSave }: { student: Student; levels: Level[]; onClose: () => void; onSave: (student: Student) => void }) {
  const [draft, setDraft] = useState(student);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <div aria-modal="true" className="fixed inset-0 z-40 flex items-end bg-ink/25 backdrop-blur-[1px] sm:items-stretch sm:justify-end" role="dialog">
      <div className="flex max-h-[92dvh] w-full flex-col rounded-t-3xl bg-white shadow-2xl sm:h-full sm:max-h-none sm:max-w-xl sm:rounded-none">
        <div className="flex items-start justify-between border-b border-[#e8eaf1] px-4 py-4 sm:px-6 sm:py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Student profile</p>
            <h2 className="mt-1 text-xl font-bold tracking-[-0.05em] sm:text-2xl">Edit student</h2>
          </div>
          <button aria-label="Close editor" className="rounded-full p-2 text-ink/45 hover:bg-[#f2f4f8]" onClick={onClose} type="button">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
          <div className="space-y-5 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
            <div className="rounded-xl bg-[#f6f8fc] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-ink/42">Student ID</p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-ink/65">{draft.uid}</p>
              <p className="mt-2 text-xs leading-5 text-ink/42">The UID is permanent and can&apos;t be changed.</p>
            </div>

            <Field label="Full name">
              <input className="input" onChange={(event) => setDraft({ ...draft, name: event.target.value })} value={draft.name} />
            </Field>
            <Field label="Email address">
              <input className="input" onChange={(event) => setDraft({ ...draft, email: event.target.value })} type="email" value={draft.email} />
            </Field>
            <Field label="Password">
              <input className="input" onChange={(event) => setDraft({ ...draft, password: event.target.value })} value={draft.password} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Current level">
                <select className="input" onChange={(event) => setDraft({ ...draft, level: event.target.value })} value={draft.level}>
                  {levels.map((level) => <option key={level.id}>{level.title}</option>)}
                </select>
              </Field>
              <Field label="Progress">
                <div className="relative">
                  <input className="input pr-10" max="100" min="0" onChange={(event) => setDraft({ ...draft, progress: Number(event.target.value) })} type="number" value={draft.progress} />
                  <span className="pointer-events-none absolute right-4 top-3.5 text-sm text-ink/40">%</span>
                </div>
              </Field>
            </div>

            <div className="rounded-xl border border-[#e7e9f0] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">Level access</p>
                  <p className="mt-1 text-xs text-ink/47">Let this student open their current level.</p>
                </div>
                <Toggle checked={draft.levelOpen} label="Toggle level access" onChange={() => setDraft({ ...draft, levelOpen: !draft.levelOpen })} />
              </div>
              <div className="mt-4 border-t border-[#edf0f5] pt-4">
                <p className="text-sm font-bold">Account status</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button className={cn("rounded-xl border px-3 py-2.5 text-sm font-bold transition", draft.status === "Active" ? "border-[#bcebd5] bg-[#edfbf4] text-[#19734e]" : "border-[#e5e8ef] text-ink/50 hover:bg-[#f8f9fc]")} onClick={() => setDraft({ ...draft, status: "Active" })} type="button">Active</button>
                  <button className={cn("rounded-xl border px-3 py-2.5 text-sm font-bold transition", draft.status === "Frozen" ? "border-[#dfe2e9] bg-[#f2f3f6] text-ink/70" : "border-[#e5e8ef] text-ink/50 hover:bg-[#f8f9fc]")} onClick={() => setDraft({ ...draft, status: "Frozen" })} type="button">Frozen</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-[#e8eaf1] px-4 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-5">
            <button className="w-full rounded-full px-4 py-3 text-sm font-bold text-ink/55 hover:bg-[#f2f4f8] sm:w-auto" onClick={onClose} type="button">Cancel</button>
            <button className="w-full rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(58,112,255,0.22)] hover:bg-brand-dark sm:w-auto" type="submit">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
