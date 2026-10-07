"use client";

import { useState, type FormEvent } from "react";

import { ArrowRightIcon, PlusIcon } from "@/components/admin/icons";
import { LevelDetailsForm } from "@/components/admin/levels/level-details-form";
import { LevelSectionCard } from "@/components/admin/levels/level-section-card";
import { LevelStudents } from "@/components/admin/levels/level-students";
import { createSection, NEW_LEVEL_ID } from "@/lib/admin/levels";
import type { Level, LevelResource, LevelSection } from "@/lib/admin/types";
import type { Student } from "@/types/student";

type LevelEditorProps = {
  level: Level;
  onAssignStudent: (studentId: string, level: Level) => Promise<void>;
  onBack: () => void;
  onRemoveStudent: (studentId: string) => Promise<void>;
  onSave: (level: Level, originalLevel: Level) => Promise<void>;
  students: Student[];
};

export function LevelEditor({
  level,
  onAssignStudent,
  onBack,
  onRemoveStudent,
  onSave,
  students,
}: LevelEditorProps) {
  const [draft, setDraft] = useState(level);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingStudents, setIsUpdatingStudents] = useState(false);
  const [uploadingResourceId, setUploadingResourceId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const isNewLevel = draft.id === NEW_LEVEL_ID;

  function updateSection(sectionId: string, section: LevelSection) {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((item) => item.id === sectionId ? section : item),
    }));
  }

  function removeSection(sectionId: string) {
    setDraft((current) => ({
      ...current,
      sections: current.sections.filter((section) => section.id !== sectionId),
    }));
  }

  async function uploadResource(sectionId: string, resourceId: string, file: File) {
    setError("");
    setUploadingResourceId(resourceId);

    try {
      const resource = draft.sections
        .find((section) => section.id === sectionId)
        ?.resources.find((item) => item.id === resourceId);

      if (!resource || resource.type === "text") {
        throw new Error("Select a file or voice document first.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("resourceType", resource.type);

      const response = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error ?? "Unable to upload the file.");

      setDraft((current) => ({
        ...current,
        sections: current.sections.map((section) => section.id !== sectionId ? section : {
          ...section,
          resources: section.resources.map((item) => {
            if (item.id !== resourceId || item.type === "text") return item;
            return {
              ...item,
              fileName: data.resource.fileName,
              storagePath: data.resource.storagePath,
              mimeType: data.resource.mimeType,
            } as LevelResource;
          }),
        }),
      }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload the file.");
    } finally {
      setUploadingResourceId(null);
    }
  }

  function validateDraft() {
    if (!draft.title.trim()) return "Add a title for this level.";
    if (draft.sections.some((section) => !section.title.trim())) return "Add a title for every section.";
    if (draft.sections.flatMap((section) => section.resources).some((resource) => resource.type !== "text" && !resource.storagePath)) {
      return "Upload or remove each file and voice document before saving.";
    }
    return "";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateDraft();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      await onSave(draft, level);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this level.");
    } finally {
      setIsSaving(false);
    }
  }

  async function assignStudent(studentId: string) {
    setIsUpdatingStudents(true);
    try {
      await onAssignStudent(studentId, draft);
    } catch (assignmentError) {
      setError(assignmentError instanceof Error ? assignmentError.message : "Unable to add the student.");
    } finally {
      setIsUpdatingStudents(false);
    }
  }

  async function removeStudent(studentId: string) {
    setIsUpdatingStudents(true);
    try {
      await onRemoveStudent(studentId);
    } catch (assignmentError) {
      setError(assignmentError instanceof Error ? assignmentError.message : "Unable to remove the student.");
    } finally {
      setIsUpdatingStudents(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button className="inline-flex items-center gap-1.5 rounded-lg py-1 text-sm font-bold text-ink/52 transition hover:text-brand" onClick={onBack} type="button">
            <ArrowRightIcon className="h-4 w-4 rotate-180" /> All levels
          </button>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-brand">Learning content</p>
          <h1 className="mt-1 text-2xl font-bold tracking-[-0.05em] sm:text-3xl">{draft.title || "New level"}</h1>
        </div>
        <span className="w-fit rounded-full bg-[#eef3ff] px-3.5 py-2 text-xs font-bold text-brand">
          {isNewLevel ? "Not saved yet" : draft.isOpen ? "Level is open" : "Level is closed"}
        </span>
      </div>

      <form className="space-y-5 sm:space-y-6" onSubmit={submit}>
        <LevelDetailsForm level={draft} onChange={setDraft} />

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">Content sections</p>
              <h2 className="mt-1 text-lg font-bold tracking-[-0.035em]">Build the learning sequence</h2>
              <p className="mt-1 text-sm text-ink/50">Each section can be opened or closed and can hold text, files, and voice documents.</p>
            </div>
            <button className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(58,112,255,0.18)] transition hover:bg-brand-dark" onClick={() => setDraft((current) => ({ ...current, sections: [...current.sections, createSection()] }))} type="button">
              <PlusIcon className="h-4 w-4" /> Add section
            </button>
          </div>

          <div className="space-y-4">
            {draft.sections.map((section, index) => (
              <LevelSectionCard
                index={index}
                key={section.id}
                onChange={(nextSection) => updateSection(section.id, nextSection)}
                onRemove={() => removeSection(section.id)}
                onUpload={(resourceId, file) => uploadResource(section.id, resourceId, file)}
                section={section}
                uploadingResourceId={uploadingResourceId}
              />
            ))}
          </div>

          {draft.sections.length === 0 && (
            <button className="flex w-full flex-col items-center rounded-2xl border border-dashed border-[#cfd7e7] bg-[#fbfcff] px-5 py-10 text-center transition hover:border-brand/50 hover:bg-[#f8faff]" onClick={() => setDraft((current) => ({ ...current, sections: [createSection()] }))} type="button">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf0ff] text-brand"><PlusIcon className="h-5 w-5" /></span>
              <span className="mt-3 text-sm font-bold">Add the first content section</span>
              <span className="mt-1 text-xs text-ink/47">Give it a title, control access, then add its documents.</span>
            </button>
          )}
        </section>

        {isNewLevel ? (
          <section className="rounded-2xl border border-dashed border-[#cfd7e7] bg-white px-5 py-6 text-center">
            <p className="text-sm font-bold">Save this level before enrolling students</p>
            <p className="mt-1 text-xs text-ink/47">Once the level is created, you can add and remove associated students here.</p>
          </section>
        ) : (
          <LevelStudents isUpdating={isUpdatingStudents} level={draft} onAssign={assignStudent} onRemove={removeStudent} students={students} />
        )}

        {error && <p aria-live="polite" className="rounded-xl border border-[#ffd8d8] bg-[#fff7f7] px-4 py-3 text-sm font-medium text-[#b64545]">{error}</p>}

        <div className="sticky bottom-3 z-10 flex flex-col-reverse gap-2 rounded-2xl border border-[#e2e6ef] bg-white/50 p-3 shadow-[0_10px_30px_rgba(1,14,54,0.1)] backdrop-blur sm:flex-row sm:justify-end sm:p-4">
          <button className="rounded-full px-4 py-3 text-sm font-bold text-ink/55 hover:bg-[#f2f4f8]" onClick={onBack} type="button">Cancel</button>
          <button className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(58,112,255,0.22)] transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving || uploadingResourceId !== null} type="submit">
            {isSaving ? "Saving…" : isNewLevel ? "Create level" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
