import type { ReactNode } from "react";

import { ArrowRightIcon, BookIcon, GridIcon, UsersIcon } from "@/components/admin/icons";
import { PageHeading } from "@/components/admin/ui/page-heading";
import { StatusPill } from "@/components/admin/ui/status-pill";
import { activityChart, dashboardCopy, levelProgress } from "@/lib/admin/content";
import type { AdminView, Level, Student } from "@/lib/admin/types";
import { cn } from "@/lib/cn";

type DashboardViewProps = {
  students: Student[];
  activeStudents: number;
  averageProgress: number;
  levels: Level[];
  onNavigate: (view: AdminView) => void;
};

export function DashboardView({ students, activeStudents, averageProgress, levels, onNavigate }: DashboardViewProps) {
  const recentStudents = students.slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeading eyebrow={dashboardCopy.eyebrow} title={dashboardCopy.title}>
        <p className="max-w-xl pb-1 text-sm text-ink/50">{dashboardCopy.description}</p>
      </PageHeading>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard detail="+8 this week" icon={<UsersIcon className="h-5 w-5" />} label="Total students" value={students.length.toString().padStart(3, "0")} />
        <StatCard detail="91% of all students" icon={<GridIcon className="h-5 w-5" />} label="Active students" value={activeStudents.toString().padStart(3, "0")} />
        <StatCard detail="Across all levels" icon={<BookIcon className="h-5 w-5" />} label="Learning levels" value={levels.length.toString().padStart(2, "0")} />
        <StatCard detail="+6% from last month" icon={<ArrowRightIcon className="h-5 w-5" />} label="Average progress" value={`${averageProgress}%`} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.42fr)_minmax(310px,0.8fr)]">
        <div className="rounded-2xl border border-[#e7e9f0] bg-white p-4 sm:p-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-[-0.035em]">{dashboardCopy.studentActivity.title}</h2>
              <p className="mt-1 text-sm text-ink/50">{dashboardCopy.studentActivity.description}</p>
            </div>
            <button className="inline-flex items-center gap-1 text-sm font-bold text-brand hover:text-brand-dark" onClick={() => onNavigate("students")} type="button">
              View students <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-7 flex h-48 items-end gap-2 sm:mt-8 sm:h-52 sm:gap-5">
            {activityChart.map(({ day, value }, index) => (
              <div className="group flex h-full min-w-0 flex-1 flex-col justify-end" key={day}>
                <span className="mb-2 text-center text-[10px] font-bold text-ink/0 transition group-hover:text-ink/55">{value}</span>
                <div className={cn("min-h-1 rounded-t-lg transition-all group-hover:opacity-80", index === 5 ? "bg-brand" : "bg-[#dbe5ff]")} style={{ height: `${value}%` }} />
                <span className="mt-3 truncate text-center text-[11px] font-semibold text-ink/45">{day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e7e9f0] bg-white p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-[-0.035em]">{dashboardCopy.levelsAtAGlance.title}</h2>
              <p className="mt-1 text-sm text-ink/50">{dashboardCopy.levelsAtAGlance.description}</p>
            </div>
            <button aria-label="Manage levels" className="shrink-0 rounded-lg p-1.5 text-brand hover:bg-[#edf2ff]" onClick={() => onNavigate("levels")} type="button">
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {levels.map((level, index) => (
              <div key={level.id}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                  <span className="truncate font-bold">{level.title}</span>
                  <span className="shrink-0 text-ink/45">{level.students} students</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#eef0f5]">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${levelProgress[index] ?? 45}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e7e9f0] bg-white">
        <div className="flex items-start justify-between gap-4 px-4 py-5 sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold tracking-[-0.035em]">{dashboardCopy.recentStudents.title}</h2>
            <p className="mt-1 text-sm text-ink/50">{dashboardCopy.recentStudents.description}</p>
          </div>
          <button className="hidden shrink-0 text-sm font-bold text-brand sm:block" onClick={() => onNavigate("students")} type="button">
            See all students
          </button>
        </div>

        <div className="divide-y divide-[#edf0f5] sm:hidden">
          {recentStudents.map((student) => <RecentStudentCard key={student.uid} student={student} />)}
        </div>

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[580px] text-left">
            <thead>
              <tr className="border-y border-[#edf0f5] bg-[#fbfcfe] text-[11px] font-bold uppercase tracking-[0.1em] text-ink/40">
                <th className="px-6 py-3.5">Student</th>
                <th className="px-4 py-3.5">Current level</th>
                <th className="px-4 py-3.5">Progress</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((student) => (
                <tr className="border-b border-[#f0f1f5] last:border-0" key={student.uid}>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold", student.tone)}>{student.initials}</span>
                      <div>
                        <p className="text-sm font-bold">{student.name}</p>
                        <p className="mt-0.5 text-xs text-ink/43">{student.uid}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-ink/65">{student.level}</td>
                  <td className="px-4 py-3.5"><Progress progress={student.progress} /></td>
                  <td className="px-6 py-3.5"><StatusPill status={student.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Progress({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#e9ecf3]">
        <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
      </div>
      <span className="text-xs font-semibold text-ink/55">{progress}%</span>
    </div>
  );
}

function RecentStudentCard({ student }: { student: Student }) {
  return (
    <article className="space-y-3 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold", student.tone)}>{student.initials}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{student.name}</p>
            <p className="mt-0.5 truncate text-xs text-ink/43">{student.uid}</p>
          </div>
        </div>
        <StatusPill status={student.status} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-ink/43">Current level</p>
          <p className="mt-1 truncate font-semibold text-ink/70">{student.level}</p>
        </div>
        <div>
          <p className="text-ink/43">Progress</p>
          <div className="mt-2"><Progress progress={student.progress} /></div>
        </div>
      </div>
    </article>
  );
}

function StatCard({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string; detail: string }) {
  return (
    <article className="rounded-2xl border border-[#e7e9f0] bg-white p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf0ff] text-brand">{icon}</span>
      <p className="mt-5 text-sm font-medium text-ink/55">{label}</p>
      <p className="mt-1 text-[1.85rem] font-bold tracking-[-0.06em]">{value}</p>
      <p className="mt-2 text-xs font-medium text-ink/40">{detail}</p>
    </article>
  );
}
