import { ArrowRightIcon, BookIcon, MoreIcon, PlusIcon } from "@/components/admin/icons";
import { PageHeading } from "@/components/admin/ui/page-heading";
import { levelCopy } from "@/lib/admin/content";
import type { Level } from "@/lib/admin/types";

export function LevelsView({ levels, onEdit, onAdd }: { levels: Level[]; onEdit: (level: Level) => void; onAdd: () => void }) {
  return (
    <div className="space-y-6 sm:space-y-7">
      <PageHeading eyebrow={levelCopy.eyebrow} title={levelCopy.title}>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(58,112,255,0.2)] transition hover:-translate-y-0.5 hover:bg-brand-dark sm:w-auto" onClick={onAdd} type="button">
          <PlusIcon className="h-4 w-4" />
          {levelCopy.addButton}
        </button>
      </PageHeading>
      <p className="-mt-3 max-w-xl text-sm leading-6 text-ink/55 sm:-mt-4">{levelCopy.description}</p>
      <section className="grid gap-4 sm:gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {levels.map((level) => (
          <article className="group rounded-2xl border border-[#e7e9f0] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#cedaff] hover:shadow-[0_15px_35px_rgba(1,14,54,0.06)]" key={level.id}>
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf0ff] text-brand"><BookIcon className="h-5 w-5" /></span>
              <button aria-label={`Edit ${level.title}`} className="shrink-0 rounded-lg p-2 text-ink/38 hover:bg-[#edf2ff] hover:text-brand" onClick={() => onEdit(level)} type="button"><MoreIcon className="h-5 w-5" /></button>
            </div>
            <h2 className="mt-5 text-xl font-bold tracking-[-0.04em]">{level.title}</h2>
            <p className="mt-1.5 text-sm text-ink/52">{level.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#edf0f5] pt-4 text-xs text-ink/50">
              <span><b className="text-ink">{level.sections.length}</b> content sections</span>
              <span><b className="text-ink">{level.students}</b> students</span>
            </div>
            <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand transition group-hover:text-brand-dark" onClick={() => onEdit(level)} type="button">
              Manage content <ArrowRightIcon className="h-4 w-4" />
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
