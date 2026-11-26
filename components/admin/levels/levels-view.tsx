"use client";

import type { ReactNode } from "react";
import { SortableList } from "@/components/admin/sortable/sortable-list";

import { ArrowRightIcon, BookIcon, MoreIcon, PlusIcon } from "@/components/admin/icons";
import { PageHeading } from "@/components/admin/ui/page-heading";
import { levelCopy } from "@/lib/admin/content";
import { getLevelStudents } from "@/lib/admin/levels";
import type { Level } from "@/lib/admin/types";
import type { Student } from "@/types/student";

type LevelsViewProps = {
  levels: Level[];
  students: Student[];
  onEdit: (level: Level) => void;
  onAdd: () => void;
  onDelete: (level: Level) => Promise<void>;
  onReorder: (levels: Level[]) => void;
  deletingLevelId: string | null;
  isReordering?: boolean;
};

export function LevelsView({
  levels,
  students,
  onEdit,
  onAdd,
  onDelete,
  onReorder,
  deletingLevelId,
  isReordering = false,
}: LevelsViewProps) {
  return (
    <div className="space-y-6 sm:space-y-7">
      <PageHeading eyebrow={levelCopy.eyebrow} title={levelCopy.title}>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(58,112,255,0.2)] transition hover:-translate-y-0.5 hover:bg-brand-dark sm:w-auto" onClick={onAdd} type="button">
          <PlusIcon className="h-4 w-4" />
          {levelCopy.addButton}
        </button>
      </PageHeading>
      <p className="-mt-3 max-w-xl text-sm leading-6 text-ink/55 sm:-mt-4">{levelCopy.description}</p>
      <section className="w-full">
        {levels.length > 0 ? (
          <SortableList
            items={levels}
            onReorder={onReorder}
            layout="grid"
            disabled={isReordering || deletingLevelId !== null}
            className="grid gap-4 sm:gap-5 md:grid-cols-2 2xl:grid-cols-3"
            renderItem={(level, index, dragHandle) => (
              <LevelCard
                level={level}
                index={index}
                dragHandle={dragHandle}
                onEdit={onEdit}
                onDelete={onDelete}
                deletingLevelId={deletingLevelId}
                studentCount={
                  getLevelStudents(students, level).length
                }
              />
            )}
          />
        ) : (
        <div className="rounded-2xl border border-dashed border-[#cfd7e7] bg-white px-6 py-14 text-center">
          <p className="text-sm font-bold">
            No levels yet
          </p>
          <p className="mt-1 text-sm text-ink/47">
            Create the first learning path to add sections
            and enroll students.
          </p>
        </div>
      )}
    </section>
    </div>
  );
}

type LevelCardProps = {
  level: Level;
  index: number;
  dragHandle: ReactNode;
  onEdit: (level: Level) => void;
  onDelete: (level: Level) => Promise<void>;
  deletingLevelId: string | null;
  studentCount: number;
};

function LevelCard({
  level,
  index,
  dragHandle,
  onEdit,
  onDelete,
  deletingLevelId,
  studentCount,
}: LevelCardProps) {
  const documentCount = level.sections.reduce(
    (total, section) => total + section.resources.length,
    0,
  );

  return (
    <article className="group h-full w-full rounded-2xl border border-[#e7e9f0] bg-white p-5 transition hover:border-[#cedaff] hover:shadow-[0_15px_35px_rgba(1,14,54,0.06)]">            
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf0ff] text-brand">
            <BookIcon className="h-5 w-5" />
          </span>

          <span className="whitespace-nowrap text-xs font-bold text-ink/50">
            Level {index + 1}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {dragHandle}

          <button
            aria-label={`Edit ${level.title}`}
            className="flex items-center gap-1 shrink-0 rounded-lg p-2 text-ink/38 hover:bg-[#edf2ff] hover:text-brand"
            onClick={() => onEdit(level)}
            type="button"
          >
            <MoreIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

            <h2 className="mt-5 text-xl font-bold tracking-[-0.04em]">{level.title}</h2>
            <p className="mt-1.5 text-sm text-ink/52">{level.description}</p>
            <div className="mt-3">
              <span className={level.isOpen ? "rounded-full bg-[#edfbf4] px-2.5 py-1 text-[11px] font-bold text-[#19734e]" : "rounded-full bg-[#f1f3f7] px-2.5 py-1 text-[11px] font-bold text-ink/55"}>{level.isOpen ? "Open" : "Closed"}</span>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#edf0f5] pt-4 text-xs text-ink/50">
              <span><b className="text-ink">{level.sections.length}</b> content sections</span>
              <span><b className="text-ink">{documentCount}</b> documents</span>
              <span><b className="text-ink">{studentCount}</b> students</span>
            </div>
            <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand transition group-hover:text-brand-dark" onClick={() => onEdit(level)} type="button">
              Manage content <ArrowRightIcon className="h-4 w-4" />
            </button>
            <button aria-label={`Delete ${level.title}`} className="mt-5 ml-4 inline-flex items-center rounded-lg px-2 py-1 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={deletingLevelId !== null} onClick={() => void onDelete(level)} type="button">
              {deletingLevelId === level.id ? "Deleting…" : "Delete level"}
            </button>
    </article>
  );
}
