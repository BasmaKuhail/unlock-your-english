import { Field } from "@/components/admin/ui/field";
import { Toggle } from "@/components/admin/ui/toggle";
import type { Level } from "@/lib/admin/types";

type LevelDetailsFormProps = {
  level: Level;
  onChange: (level: Level) => void;
};

export function LevelDetailsForm({ level, onChange }: LevelDetailsFormProps) {
  return (
    <section className="rounded-2xl border border-[#e7e9f0] bg-white p-4 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
          Level details
        </p>
        <h2 className="mt-1 text-lg font-bold tracking-[-0.035em]">
          Start with the learning path
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <Field label="Level title">
          <input
            className="input"
            maxLength={120}
            onChange={(event) => onChange({ ...level, title: event.target.value })}
            placeholder="For example, Beginner 1"
            required
            value={level.title}
          />
        </Field>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-ink/57">
            Description
          </span>
          <textarea
            className="min-h-24 w-full resize-y rounded-xl border border-[#e1e5ed] bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-4 focus:ring-brand/10"
            maxLength={600}
            onChange={(event) =>
              onChange({ ...level, description: event.target.value })
            }
            placeholder="Describe what students will learn in this level."
            value={level.description}
          />
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between gap-5 border-t border-[#edf0f5] pt-5">
        <div>
          <p className="text-sm font-bold">Level availability</p>
          <p className="mt-1 text-xs leading-5 text-ink/47">
            {level.isOpen
              ? "Students can open this level."
              : "This level is hidden from students."}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Toggle
            checked={level.isOpen}
            label="Toggle level availability"
            onChange={() => onChange({ ...level, isOpen: !level.isOpen })}
          />
          <span className="text-xs font-bold text-ink/55">
            {level.isOpen ? "Open" : "Closed"}
          </span>
        </div>
      </div>
    </section>
  );
}
