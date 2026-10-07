import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { CreateStudentFormData } from "@/components/admin/students/student-editor";
import { createLevel, NEW_LEVEL_ID } from "@/lib/admin/levels";
import { getStudentInitials, getStudentTone } from "@/lib/admin/student-presentation";
import type { Level, LevelSection, StudentFilter } from "@/lib/admin/types";
import type { Student } from "@/types/student";

type StudentApiRecord = Omit<Student, "initials" | "tone">;

function withPresentation(student: StudentApiRecord): Student {
  return {
    ...student,
    initials: getStudentInitials(student.name),
    tone: getStudentTone(student.studentId),
  };
}

export function useAdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(true);
  const [search, setSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState<StudentFilter>("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [toast, setToast] = useState("");
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((message: string) => {
    setToast(message);

    if (toastTimeout.current) clearTimeout(toastTimeout.current);

    toastTimeout.current = setTimeout(() => setToast(""), 2400);
  }, []);

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await fetch("/api/admin/students");
        if (!response.ok) throw new Error("Unable to load students.");

        const data = await response.json();
        setStudents(data.students.map(withPresentation));
      } catch (error) {
        console.error("Failed to load students:", error);
        notify("Unable to load students.");
      } finally {
        setIsLoadingStudents(false);
      }
    }

    void loadStudents();
  }, [notify]);

  useEffect(() => {
    async function loadLevels() {
      try {
        const response = await fetch("/api/admin/levels");
        if (!response.ok) throw new Error("Unable to load levels.");

        const data = await response.json();
        setLevels(data.levels);
      } catch (error) {
        console.error("Failed to load levels:", error);
        notify("Unable to load levels.");
      } finally {
        setIsLoadingLevels(false);
      }
    }

    void loadLevels();
  }, [notify]);

  useEffect(() => () => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
  }, []);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.studentId.toLowerCase().includes(normalizedSearch);

      return matchesSearch && (studentFilter === "All" || student.status === studentFilter);
    });
  }, [search, studentFilter, students]);

  const activeStudents = useMemo(
    () => students.filter((student) => student.status === "Active").length,
    [students],
  );

  const averageProgress = useMemo(() => {
    if (students.length === 0) return 0;
    return Math.round(students.reduce((sum, student) => sum + student.progress, 0) / students.length);
  }, [students]);

  const saveStudent = useCallback(async (student: Student, newPassword?: string) => {
    try {
      const response = await fetch(`/api/admin/students/${student.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: student.name,
          currentLevelId: student.levelId,
          levelOpen: student.levelOpen,
          status: student.status === "Frozen" ? "frozen" : "active",
          ...(newPassword ? { newPassword } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to update student.");

      const updatedStudent = withPresentation(data.student);
      setStudents((current) => current.map((item) => item.uid === updatedStudent.uid ? updatedStudent : item));
      setSelectedStudent(null);
      notify(`${updatedStudent.name}'s details were saved.`);
    } catch (error) {
      console.error("Failed to update student:", error);
      const message = error instanceof Error ? error.message : "Unable to update student.";
      notify(message);
    }
  }, [notify]);

  const addStudent = useCallback(() => setIsCreatingStudent(true), []);

  const toggleStudentAccess = useCallback(async (uid: string) => {
    const student = students.find((item) => item.uid === uid);
    if (!student) return;

    try {
      const response = await fetch(`/api/admin/students/${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ levelOpen: !student.levelOpen }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to update level access.");

      const updatedStudent = withPresentation(data.student);
      setStudents((current) => current.map((item) => item.uid === uid ? updatedStudent : item));
      notify(`${student.name}'s level access was ${updatedStudent.levelOpen ? "opened" : "closed"}.`);
    } catch (error) {
      console.error("Failed to update level access:", error);
      notify(error instanceof Error ? error.message : "Unable to update level access.");
    }
  }, [notify, students]);

  const createStudent = useCallback(async (formData: CreateStudentFormData) => {
    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: formData.name,
          password: formData.password,
          currentLevelId: formData.levelId,
          levelOpen: formData.levelOpen,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to create student.");

      const createdStudent = withPresentation(data.student);
      setStudents((current) => [createdStudent, ...current]);
      setIsCreatingStudent(false);
      notify(`${createdStudent.name} was created with ID ${createdStudent.studentId}.`);
    } catch (error) {
      console.error("Failed to create student:", error);
      notify(error instanceof Error ? error.message : "Unable to create student.");
    }
  }, [notify]);

  const addLevel = useCallback(() => {
    setSelectedLevel({
      id: NEW_LEVEL_ID,
      title: "",
      description: "",
      order: levels.length,
      isOpen: false,
      sections: [],
    });
  }, [levels.length]);

const saveLevel = useCallback(
  async (
    level: Level,
    originalLevel: Level,
  ) => {

    if (level.id === NEW_LEVEL_ID) {
      const response = await fetch("/api/admin/levels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: level.title,
          description: level.description,
          isOpen: level.isOpen,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Unable to create level.",
        );
      }

      const createdLevel: Level = data.level;

      const createdSections = await Promise.all(
        level.sections.map(async (section) => {
          const sectionResponse = await fetch(
            `/api/admin/levels/${createdLevel.id}/sections`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: section.title,
                isOpen: section.isOpen,
              }),
            },
          );

          const sectionData = await sectionResponse.json();

          if (!sectionResponse.ok) {
            throw new Error(
              sectionData.error ??
                `Unable to create section "${section.title}".`,
            );
          }

          return sectionData.section;
        }),
      );

      const completeLevel: Level = {
        ...createdLevel,
        sections: createdSections,
      };

      setLevels((current) => [
        ...current,
        completeLevel,
      ]);

      setSelectedLevel(null);

      notify(`${completeLevel.title} was created.`);

      return;
    }

    const levelResponse = await fetch(
      `/api/admin/levels/${level.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: level.title,
          description: level.description,
          isOpen: level.isOpen,
        }),
      },
    );

    const levelData = await levelResponse.json();

    if (!levelResponse.ok) {
      throw new Error(
        levelData.error ?? "Unable to update level.",
      );
    }

    const newSections = level.sections.filter(
      (section) =>
        !originalLevel.sections.some(
          (originalSection) =>
            originalSection.id === section.id,
        ),
    );

    const existingSections = level.sections.filter(
      (section) =>
        originalLevel.sections.some(
          (originalSection) =>
            originalSection.id === section.id,
        ),
    );

    const removedSections =
      originalLevel.sections.filter(
        (originalSection) =>
          !level.sections.some(
            (section) =>
              section.id === originalSection.id,
          ),
      );

    const createdSections = await Promise.all(
      newSections.map(async (section) => {
        const response = await fetch(
          `/api/admin/levels/${level.id}/sections`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: section.title,
              isOpen: section.isOpen,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ??
              `Unable to create section "${section.title}".`,
          );
        }

        return data.section as LevelSection;
      }),
    );

    await Promise.all(
      existingSections.map(async (section) => {
        const originalSection =
          originalLevel.sections.find(
            (item) => item.id === section.id,
          );

        if (!originalSection) {
          return;
        }

        const hasChanged =
          section.title !== originalSection.title ||
          section.isOpen !== originalSection.isOpen;

        if (!hasChanged) {
          return;
        }

        const response = await fetch(
          `/api/admin/levels/${level.id}/sections/${section.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: section.title,
              isOpen: section.isOpen,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ??
              `Unable to update section "${section.title}".`,
          );
        }
      }),
    );

    await Promise.all(
      removedSections.map(async (section) => {
        const response = await fetch(
          `/api/admin/levels/${level.id}/sections/${section.id}`,
          {
            method: "DELETE",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ??
              `Unable to remove section "${section.title}".`,
          );
        }
      }),
    );


    const updatedSections = [
      ...existingSections,
      ...createdSections,
    ].sort((a, b) => a.order - b.order);

    const updatedLevel: Level = {
      ...level,
      title: levelData.level.title,
      description: levelData.level.description,
      isOpen: levelData.level.isOpen,
      sections: updatedSections,
    };

    setLevels((current) =>
      current.map((item) =>
        item.id === level.id
          ? updatedLevel
          : item,
      ),
    );

    setSelectedLevel(null);

    notify(`${updatedLevel.title} was updated.`);
  },
  [notify],
);

  const setStudentLevel = useCallback(async (studentId: string, level: Level | null) => {
    const response = await fetch(`/api/admin/students/${studentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentLevelId: level?.id ?? null }),
    });
    const data = await response.json();
    if (!response.ok) {
      const message = data.error ?? "Unable to update student level.";
      notify(message);
      throw new Error(message);
    }

    const updatedStudent = withPresentation(data.student);
    setStudents((current) => current.map((student) => student.uid === updatedStudent.uid ? updatedStudent : student));
    notify(level ? `${updatedStudent.name} was added to ${level.title}.` : `${updatedStudent.name} was removed from this level.`);
  }, [notify]);

  const assignStudentToLevel = useCallback((studentId: string, level: Level) => setStudentLevel(studentId, level), [setStudentLevel]);
  const removeStudentFromLevel = useCallback((studentId: string) => setStudentLevel(studentId, null), [setStudentLevel]);

  return {
    activeStudents,
    addLevel,
    addStudent,
    assignStudentToLevel,
    averageProgress,
    createStudent,
    filteredStudents,
    isCreatingStudent,
    isLoadingLevels,
    isLoadingStudents,
    levels,
    removeStudentFromLevel,
    saveLevel,
    saveStudent,
    search,
    selectedLevel,
    selectedStudent,
    setIsCreatingStudent,
    setSearch,
    setSelectedLevel,
    setSelectedStudent,
    setStudentFilter,
    studentFilter,
    students,
    toast,
    toggleStudentAccess,
  };
}
