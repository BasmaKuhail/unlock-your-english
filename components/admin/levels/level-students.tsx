import { CloseIcon, PlusIcon, UsersIcon } from "@/components/admin/icons";
import { getLevelStudents } from "@/lib/admin/levels";
import type { Level } from "@/lib/admin/types";
import { cn } from "@/lib/cn";
import type { Student } from "@/types/student";
import { useMemo, useState } from "react";

type LevelStudentsProps = {
  isUpdating: boolean;
  level: Level;
  onAssign: (studentId: string) => void;
  onRemove: (studentId: string) => void;
  students: Student[];
};

export function LevelStudents({
  isUpdating,
  level,
  onAssign,
  onRemove,
  students,
}: LevelStudentsProps) {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const associatedStudents = useMemo(
    () => getLevelStudents(students, level),
    [level, students],
  );
  const availableStudents = students.filter(
    (student) => !associatedStudents.some((item) => item.uid === student.uid),
  );

  function assignStudent() {
    if (!selectedStudentId) return;
    onAssign(selectedStudentId);
    setSelectedStudentId("");
  }

  return (
    <section className="rounded-2xl border border-[#e7e9f0] bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
            Enrolled students
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-[-0.035em]">
            Students in this level
          </h2>
          <p className="mt-1 text-sm leading-6 text-ink/50">
            Assign a student here or remove them from this learning path.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-bold text-brand">
          <UsersIcon className="h-3.5 w-3.5" />
          {associatedStudents.length} {associatedStudents.length === 1 ? "student" : "students"}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-2 rounded-xl bg-[#f7f9fe] p-3 sm:flex-row">
        <label className="sr-only" htmlFor="level-student-select">
          Select a student to add
        </label>
        <select
          className="input flex-1 bg-white"
          disabled={isUpdating || availableStudents.length === 0}
          id="level-student-select"
          onChange={(event) => setSelectedStudentId(event.target.value)}
          value={selectedStudentId}
        >
          <option value="">
            {availableStudents.length ? "Select a student to add" : "No more students to add"}
          </option>
          {availableStudents.map((student) => (
            <option key={student.uid} value={student.uid}>
              {student.name} · {student.studentId}
            </option>
          ))}
        </select>
        <button
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedStudentId || isUpdating}
          onClick={assignStudent}
          type="button"
        >
          <PlusIcon className="h-4 w-4" /> Add student
        </button>
      </div>

      {associatedStudents.length > 0 ? (
        <div className="mt-4 divide-y divide-[#edf0f5] rounded-xl border border-[#e7e9f0]">
          {associatedStudents.map((student) => (
            <div className="flex items-center justify-between gap-4 px-3 py-3 sm:px-4" key={student.uid}>
              <div className="flex min-w-0 items-center gap-3">
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold", student.tone)}>
                  {student.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{student.name}</p>
                  <p className="mt-0.5 truncate font-mono text-xs text-ink/43">{student.studentId}</p>
                </div>
              </div>
              <button
                aria-label={`Remove ${student.name} from this level`}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-bold text-ink/45 transition hover:bg-[#fff3f3] hover:text-[#c14a4a] disabled:opacity-50"
                disabled={isUpdating}
                onClick={() => onRemove(student.uid)}
                type="button"
              >
                <CloseIcon className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-[#d3dae8] px-4 py-7 text-center">
          <p className="text-sm font-bold">No students assigned yet</p>
          <p className="mt-1 text-xs text-ink/47">Use the selector above to add the first student.</p>
        </div>
      )}
    </section>
  );
}
