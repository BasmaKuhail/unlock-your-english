"use client";

import { useAdminDashboard } from "@/hooks/use-admin-dashboard";

import { DashboardView } from "@/components/admin/dashboard/dashboard-view";
import { LevelEditor } from "@/components/admin/levels/level-editor";
import { LevelsView } from "@/components/admin/levels/levels-view";
import { StudentEditor } from "@/components/admin/students/student-editor";
import { StudentsView } from "@/components/admin/students/students-view";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import type { AdminProfile, AdminView } from "@/lib/admin/types";

export function AdminDashboard({
  adminProfile,
  view,
}: {
  adminProfile: AdminProfile;
  view: AdminView;
}) {
  const dashboard = useAdminDashboard();

  return (
    <DashboardLayout
      toast={dashboard.toast}
      view={view}
    >
      {view === "dashboard" && (
        <DashboardView
          activeStudents={dashboard.activeStudents}
          averageProgress={dashboard.averageProgress}
          levels={dashboard.levels}
          adminName={adminProfile.name}
          students={dashboard.students}
        />
      )}

      {view === "students" && (
        <StudentsView
          filter={dashboard.studentFilter}
          filteredStudents={dashboard.filteredStudents}
          onAdd={dashboard.addStudent}
          onEdit={dashboard.setSelectedStudent}
          onFilter={dashboard.setStudentFilter}
          onSearch={dashboard.setSearch}
          onToggleAccess={dashboard.toggleStudentAccess}
          search={dashboard.search}
        />
      )}

      {view === "levels" && (
        <LevelsView
          levels={dashboard.levels}
          onAdd={dashboard.addLevel}
          onEdit={dashboard.setSelectedLevel}
        />
      )}

      {dashboard.isCreatingStudent && (
        <StudentEditor
          mode="create"
          levels={dashboard.levels}
          onClose={() => dashboard.setIsCreatingStudent(false)}
          onCreate={dashboard.createStudent}
        />
      )}

      {dashboard.selectedStudent && (
        <StudentEditor
          key={dashboard.selectedStudent.uid}
          mode="edit"
          student={dashboard.selectedStudent}
          levels={dashboard.levels}
          onClose={() => dashboard.setSelectedStudent(null)}
          onSave={dashboard.saveStudent}
        />
      )}

      {dashboard.selectedLevel && (
        <LevelEditor
          key={dashboard.selectedLevel.id}
          level={dashboard.selectedLevel}
          onClose={() => dashboard.setSelectedLevel(null)}
          onSave={dashboard.saveLevel}
        />
      )}
    </DashboardLayout>
  );
}
