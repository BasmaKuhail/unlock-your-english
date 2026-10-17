
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

export function createTextResource(
  order = 0,
): LevelResource {
  return {
    id: createId("resource"),
    title: "Text document",
    type: "text",
    content: "",
    order,
  };
}

export function createLinkResource(
  order = 0,
): LevelResource {
  return {
    id: createId("resource"),
    title: "External link",
    type: "link",
    url: "",
    order,
  };
}

export function createUploadedResource(
  type: Extract<ResourceType, "file" | "voice">,
  order = 0,
): LevelResource {
  return {
    id: createId("resource"),
    title:
      type === "voice"
        ? "Voice document"
        : "File document",
    type,
    fileName: "",
    storagePath: "",
    mimeType: "",
    size: 0,
    order,
  };
}

export function createSection(
  order = 0,
): LevelSection {
  return {
    id: createId("section"),
    title: "New section",
    isOpen: false,
    order,
    resources: [createTextResource(0)],
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

export function getLevelStudents(
  students: Student[],
  level: Level,
) {
  return students.filter(
    (student) =>
      student.levelId === level.id ||
      (!student.levelId && student.level === level.title),
  );
}
