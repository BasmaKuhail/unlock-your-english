import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CreateStudentFormData } from "@/components/admin/students/student-editor";
import { initialLevels } from "@/lib/admin/data";
import {
  getStudentInitials,
  getStudentTone,
} from "@/lib/admin/student-presentation";
import type {
  AdminView,
  Level,
  StudentFilter,
} from "@/lib/admin/types";
import {Student} from "@/types/student"

export function useAdminDashboard() {
  const [view, setView] = useState<AdminView>("dashboard");

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);

  const [levels, setLevels] = useState(initialLevels);

  const [search, setSearch] = useState("");
  const [studentFilter, setStudentFilter] =
    useState<StudentFilter>("All");

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const [selectedLevel, setSelectedLevel] =
    useState<Level | null>(null);

  const [toast, setToast] = useState("");
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const toastTimeout =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadStudents() {
      try {
        setIsLoadingStudents(true);

        const response = await fetch("/api/admin/students");

        if (!response.ok) {
          throw new Error("Unable to load students.");
        }

        const data = await response.json();

        const loadedStudents: Student[] = data.students.map(
          (student: Omit<Student, "initials" | "tone">) => ({
            ...student,
            initials: getStudentInitials(student.name),
            tone: getStudentTone(student.studentId),
          }),
        );

        setStudents(loadedStudents);
      } catch (error) {
        console.error("Failed to load students:", error);
      } finally {
        setIsLoadingStudents(false);
      }
    }

    void loadStudents();
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) {
        clearTimeout(toastTimeout.current);
      }
    };
  }, []);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.studentId.toLowerCase().includes(normalizedSearch);

      const matchesFilter =
        studentFilter === "All" ||
        student.status === studentFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, studentFilter, students]);

  const activeStudents = useMemo(
    () =>
      students.filter(
        (student) => student.status === "Active",
      ).length,
    [students],
  );

  const averageProgress = useMemo(() => {
    if (students.length === 0) {
      return 0;
    }

    const totalProgress = students.reduce(
      (sum, student) => sum + (student.progress ?? 0),
      0,
    );

    return Math.round(totalProgress / students.length);
  }, [students]);

  const notify = useCallback((message: string) => {
    setToast(message);

    if (toastTimeout.current) {
      clearTimeout(toastTimeout.current);
    }

    toastTimeout.current = setTimeout(() => {
      setToast("");
    }, 2400);
  }, []);

  const saveStudent = useCallback(
    (student: Student) => {
      setStudents((current) =>
        current.some((item) => item.uid === student.uid)
          ? current.map((item) =>
              item.uid === student.uid ? student : item,
            )
          : [...current, student],
      );

      setSelectedStudent(null);

      notify(`${student.name}'s details were saved.`);
    },
    [notify],
  );

  const addStudent = useCallback(() => {
    setIsCreatingStudent(true);
  }, []);

  const toggleStudentAccess = useCallback((uid: string) => {
    // Still local-only for now.
    // We'll connect this to Firebase when we build student updates.
    setStudents((current) =>
      current.map((student) =>
        student.uid === uid
          ? {
              ...student,
              levelOpen: !student.levelOpen,
            }
          : student,
      ),
    );
  }, []);

  const saveLevel = useCallback(
    (level: Level) => {
      setLevels((current) =>
        current.map((item) =>
          item.id === level.id ? level : item,
        ),
      );

      setSelectedLevel(null);

      notify(`${level.title} was updated.`);
    },
    [notify],
  );
  const createStudent = useCallback(
  async (formData: CreateStudentFormData) => {
    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: formData.name,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to create student.");
      }

      const createdStudent: Student = {
        uid: data.student.uid,
        studentId: data.student.studentId,
        name: data.student.displayName,

        // We'll persist these properly shortly.
        level: formData.level,
        levelOpen: formData.levelOpen,

        progress: 0,
        status: "Active",

        initials: getStudentInitials(data.student.displayName),
        tone: getStudentTone(data.student.studentId),
      };

      setStudents((current) => [createdStudent, ...current]);

      setIsCreatingStudent(false);

      notify(
        `${createdStudent.name} was created with ID ${createdStudent.studentId}.`,
      );
    } catch (error) {
      console.error("Failed to create student:", error);

      notify(
        error instanceof Error
          ? error.message
          : "Unable to create student.",
      );
    }
  },
  [notify],
);

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
    isLoadingStudents,
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
    isCreatingStudent,
    setIsCreatingStudent,
    createStudent,
  };
}