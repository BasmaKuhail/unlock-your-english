import { MoreIcon, PlusIcon, SearchIcon } from "@/components/admin/icons";
import { PageHeading } from "@/components/admin/ui/page-heading";
import { StatusPill } from "@/components/admin/ui/status-pill";
import { Toggle } from "@/components/admin/ui/toggle";
import { studentCopy } from "@/lib/admin/content";
import type { Student, StudentFilter } from "@/lib/admin/types";
import { cn } from "@/lib/cn";

type StudentsViewProps = {
  filteredStudents: Student[];
  search: string;
  filter: StudentFilter;
  onSearch: (value: string) => void;
  onFilter: (value: StudentFilter) => void;
  onAdd: () => void;
  onEdit: (student: Student) => void;
  onToggleAccess: (uid: string) => void;
};

const filters: StudentFilter[] = ["All", "Active", "Frozen"];

export function StudentsView({ filteredStudents, search, filter, onSearch, onFilter, onAdd, onEdit, onToggleAccess }: StudentsViewProps) {
  return (
    <div className="space-y-6 sm:space-y-7">
      <PageHeading eyebrow={studentCopy.eyebrow} title={studentCopy.title}>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(58,112,255,0.2)] transition hover:-translate-y-0.5 hover:bg-brand-dark sm:w-auto" onClick={onAdd} type="button">
          <PlusIcon className="h-4 w-4" />
          {studentCopy.addButton}
        </button>
      </PageHeading>

      <section className="overflow-hidden rounded-2xl border border-[#e7e9f0] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#edf0f5] p-4 sm:gap-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-sm">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input className="h-11 w-full rounded-xl border border-[#e4e7ef] bg-[#fbfcfe] pl-10 pr-4 text-sm outline-none placeholder:text-ink/35 focus:border-brand focus:ring-4 focus:ring-brand/10" id="student-search" onChange={(event) => onSearch(event.target.value)} placeholder={studentCopy.searchPlaceholder} value={search} />
          </label>
          <div className="flex w-full rounded-xl bg-[#f4f6fa] p-1 sm:w-auto">
            {filters.map((item) => (
              <button className={cn("min-w-0 flex-1 rounded-lg px-2 py-2 text-xs font-bold transition sm:flex-none sm:px-4", filter === item ? "bg-white text-ink shadow-sm" : "text-ink/45 hover:text-ink")} key={item} onClick={() => onFilter(item)} type="button">
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[#edf0f5] xl:hidden">
          {filteredStudents.map((student) => <StudentCard key={student.uid} onEdit={onEdit} onToggleAccess={onToggleAccess} student={student} />)}
          {filteredStudents.length === 0 && <p className="px-6 py-16 text-center text-sm text-ink/45">{studentCopy.noResults}</p>}
        </div>

        <div className="hidden overflow-x-auto xl:block">
          <table className="w-full min-w-[940px] text-left">
            <thead>
              <tr className="border-b border-[#edf0f5] bg-[#fbfcfe] text-[11px] font-bold uppercase tracking-[0.1em] text-ink/40">
                <th className="w-[30%] px-6 py-4">Student</th>
                <th className="px-4 py-4">Student ID</th>
                <th className="px-4 py-4">Current level</th>
                <th className="px-4 py-4">Progress</th>
                <th className="px-4 py-4">Level access</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => <StudentRow key={student.uid} onEdit={onEdit} onToggleAccess={onToggleAccess} student={student} />)}
              {filteredStudents.length === 0 && <tr><td className="px-6 py-16 text-center text-sm text-ink/45" colSpan={7}>{studentCopy.noResults}</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#edf0f5] px-4 py-4 text-xs font-medium text-ink/45 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span>Showing {filteredStudents.length} students</span>
          <div className="flex gap-1">
            <button className="rounded-lg px-2 py-1.5 hover:bg-[#f3f5fa]" type="button">Previous</button>
            <button className="rounded-lg bg-[#eaf0ff] px-2.5 py-1.5 font-bold text-brand" type="button">1</button>
            <button className="rounded-lg px-2 py-1.5 hover:bg-[#f3f5fa]" type="button">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StudentCard({ student, onEdit, onToggleAccess }: { student: Student; onEdit: (student: Student) => void; onToggleAccess: (uid: string) => void }) {
  return (
    <article className="space-y-4 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[10px] font-bold", student.tone)}>{student.initials}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{student.name}</p>
            <p className="mt-0.5 truncate text-xs text-ink/43">{student.email}</p>
          </div>
        </div>
        <button aria-label={`Edit ${student.name}`} className="shrink-0 rounded-lg p-2 text-ink/42 transition hover:bg-[#edf2ff] hover:text-brand" onClick={() => onEdit(student)} type="button">
          <MoreIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-ink/43">Student ID</p>
          <p className="mt-1 truncate font-mono font-semibold text-ink/65">{student.uid}</p>
        </div>
        <div>
          <p className="text-ink/43">Current level</p>
          <p className="mt-1 truncate font-semibold text-ink/65">{student.level}</p>
        </div>
        <div>
          <p className="text-ink/43">Progress</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#e9ecf3]">
              <div className="h-full rounded-full bg-brand" style={{ width: `${student.progress}%` }} />
            </div>
            <span className="font-bold text-ink/55">{student.progress}%</span>
          </div>
        </div>
        <div>
          <p className="text-ink/43">Status</p>
          <div className="mt-1"><StatusPill status={student.status} /></div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#edf0f5] pt-3">
        <span className="text-xs font-semibold text-ink/55">Level access</span>
        <div className="flex items-center gap-2.5">
          <Toggle checked={student.levelOpen} label={`Toggle level access for ${student.name}`} onChange={() => onToggleAccess(student.uid)} />
          <span className={cn("text-xs font-semibold", student.levelOpen ? "text-[#19734e]" : "text-ink/42")}>{student.levelOpen ? "Open" : "Closed"}</span>
        </div>
      </div>
    </article>
  );
}

function StudentRow({ student, onEdit, onToggleAccess }: { student: Student; onEdit: (student: Student) => void; onToggleAccess: (uid: string) => void }) {
  return (
    <tr className="border-b border-[#f0f1f5] transition-colors hover:bg-[#fbfcff] last:border-0">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-bold", student.tone)}>{student.initials}</span>
          <div>
            <p className="text-sm font-bold">{student.name}</p>
            <p className="mt-0.5 text-xs text-ink/43">{student.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 font-mono text-xs text-ink/55">{student.uid}</td>
      <td className="px-4 py-4 text-sm text-ink/65">{student.level}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-[70px] overflow-hidden rounded-full bg-[#e9ecf3]"><div className="h-full rounded-full bg-brand" style={{ width: `${student.progress}%` }} /></div>
          <span className="text-xs font-bold text-ink/55">{student.progress}%</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2.5">
          <Toggle checked={student.levelOpen} label={`Toggle level access for ${student.name}`} onChange={() => onToggleAccess(student.uid)} />
          <span className={cn("text-xs font-semibold", student.levelOpen ? "text-[#19734e]" : "text-ink/42")}>{student.levelOpen ? "Open" : "Closed"}</span>
        </div>
      </td>
      <td className="px-4 py-4"><StatusPill status={student.status} /></td>
      <td className="px-6 py-4 text-right">
        <button aria-label={`Edit ${student.name}`} className="rounded-lg p-2 text-ink/42 transition hover:bg-[#edf2ff] hover:text-brand" onClick={() => onEdit(student)} type="button">
          <MoreIcon className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}
