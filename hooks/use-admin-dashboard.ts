import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { initialLevels, initialStudents } from "@/lib/admin/data";
import type { AdminView, Level, Student, StudentFilter } from "@/lib/admin/types";

const newStudentPassword = "••••••••";

export function useAdminDashboard() {
  const [view, setView] = useState<AdminView>("dashboard");
  const [students, setStudents] = useState(initialStudents);
  const [levels, setLevels] = useState(initialLevels);
  const [search, setSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState<StudentFilter>("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [toast, setToast] = useState("");
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (toastTimeout.current) {
      clearTimeout(toastTimeout.current);
    }
  }, []);

  const filteredStudents = useMemo(() => students.filter((student) => {
    const matchesSearch = `${student.name} ${student.uid} ${student.email}`
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesSearch && (studentFilter === "All" || student.status === studentFilter);
  }), [search, studentFilter, students]);

  const activeStudents = useMemo(
    () => students.filter((student) => student.status === "Active").length,
    [students],
  );

  const averageProgress = useMemo(
    () => Math.round(students.reduce((sum, student) => sum + student.progress, 0) / students.length),
    [students],
  );

  const notify = useCallback((message: string) => {
    setToast(message);

    if (toastTimeout.current) {
      clearTimeout(toastTimeout.current);
    }

    toastTimeout.current = setTimeout(() => setToast(""), 2400);
  }, []);

  const saveStudent = useCallback((student: Student) => {
    setStudents((current) => current.some((item) => item.uid === student.uid)
      ? current.map((item) => item.uid === student.uid ? student : item)
      : [...current, student]);
    setSelectedStudent(null);
    notify(`${student.name}'s details were saved.`);
  }, [notify]);

  const addStudent = useCallback(() => {
    setSelectedStudent({
      uid: `UY-${String(Date.now()).slice(-5)}`,
      name: "New student",
      email: "student@email.com",
      password: newStudentPassword,
      level: "Beginner 1",
      progress: 0,
      status: "Active",
      levelOpen: true,
      initials: "NS",
      tone: "bg-[#dceaff] text-[#3567a8]",
    });
  }, []);

  const toggleStudentAccess = useCallback((uid: string) => {
    setStudents((current) => current.map((student) => (
      student.uid === uid ? { ...student, levelOpen: !student.levelOpen } : student
    )));
  }, []);

  const saveLevel = useCallback((level: Level) => {
    setLevels((current) => current.map((item) => item.id === level.id ? level : item));
    setSelectedLevel(null);
    notify(`${level.title} was updated.`);
  }, [notify]);

  const addLevel = useCallback(() => {
    const newLevel: Level = {
      id: Date.now(),
      title: `New level ${levels.length + 1}`,
      description: "Add a short description for this level.",
      students: 0,
      sections: [],
    };

    setLevels((current) => [...current, newLevel]);
    setSelectedLevel(newLevel);
  }, [levels.length]);

  return {
    activeStudents,
    addLevel,
    addStudent,
    averageProgress,
    filteredStudents,
    levels,
    saveLevel,
    saveStudent,
    search,
    selectedLevel,
    selectedStudent,
    setSearch,
    setSelectedLevel,
    setSelectedStudent,
    setStudentFilter,
    setView,
    studentFilter,
    students,
    toast,
    toggleStudentAccess,
    view,
  };
}
