import type {
  Level,
  LevelResource,
  LevelSection,
  ResourceType,
} from "@/lib/admin/types";
import type { Student } from "@/types/student";

export const NEW_LEVEL_ID = "__new__";

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createTextResource(): LevelResource {
  return {
    id: createId("resource"),
    title: "Text document",
    type: "text",
    content: "",
  };
}

export function createUploadedResource(
  type: Extract<ResourceType, "file" | "voice">,
): LevelResource {
  return {
    id: createId("resource"),
    title: type === "voice" ? "Voice document" : "File document",
    type,
    fileName: "",
    storagePath: "",
    mimeType: "",
  };
}

export function createSection(): LevelSection {
  return {
    id: createId("section"),
    title: "New section",
    isOpen: false,
    order: 0,
    resources: [createTextResource()],
  };
}

export function createLevel(): Level {
  return {
    id: NEW_LEVEL_ID,
    title: "",
    description: "",
    isOpen: false,
    order: 0,
    sections: [],
  };
}

export function getLevelStudents(students: Student[], level: Level) {
  return students.filter(
    (student) =>
      student.levelId === level.id ||
      (!student.levelId && student.level === level.title),
  );
}
