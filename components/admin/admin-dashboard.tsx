"use client";

import { useAdminDashboard } from "@/hooks/use-admin-dashboard";

import { DashboardView } from "@/components/admin/dashboard/dashboard-view";
import { LevelEditor } from "@/components/admin/levels/level-editor";
import { LevelsView } from "@/components/admin/levels/levels-view";
import { StudentEditor } from "@/components/admin/students/student-editor";
import { StudentsView } from "@/components/admin/students/students-view";
import { DashboardLayout } from "@/layouts/dashboard-layout";

export function AdminDashboard() {
  const dashboard = useAdminDashboard();

  return (
    <DashboardLayout
      onViewChange={dashboard.setView}
      toast={dashboard.toast}
      view={dashboard.view}
    >
      {dashboard.view === "dashboard" && (
        <DashboardView
          activeStudents={dashboard.activeStudents}
          averageProgress={dashboard.averageProgress}
          levels={dashboard.levels}
          onNavigate={dashboard.setView}
          students={dashboard.students}
        />
      )}

      {dashboard.view === "students" && (
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

      {dashboard.view === "levels" && (
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