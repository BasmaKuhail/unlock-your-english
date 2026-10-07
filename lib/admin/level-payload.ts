import type {
  Level,
  LevelResource,
  LevelSection,
  ResourceType,
} from "@/lib/admin/types";
import { createId } from "@/lib/admin/levels";

type LevelInput = Pick<Level, "title" | "description" | "isOpen" | "sections">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function normaliseResource(value: unknown): LevelResource | null {
  if (!isRecord(value)) {
    return null;
  }

  const type = value.type;
  const title = stringValue(value.title, 160);
  const id = stringValue(value.id, 160) || createId("resource");

  if (type === "text") {
    return {
      id,
      title: title || "Text document",
      type,
      content: stringValue(value.content, 50_000),
    };
  }

  if (type !== "file" && type !== "voice") {
    return null;
  }

  const fileName = stringValue(value.fileName, 255);
  const storagePath = stringValue(value.storagePath, 500);
  const mimeType = stringValue(value.mimeType, 150);

  if (!fileName || !storagePath) {
    return null;
  }

  return {
    id,
    title: title || fileName,
    type: type as Extract<ResourceType, "file" | "voice">,
    fileName,
    storagePath,
    mimeType,
  };
}

function normaliseSection(value: unknown): LevelSection | null {
  if (!isRecord(value)) {
    return null;
  }

  const title = stringValue(value.title, 160);

  if (!title) {
    return null;
  }

  const rawResources = Array.isArray(value.resources) ? value.resources : [];
  const resources = rawResources.map(normaliseResource).filter(
    (resource): resource is LevelResource => resource !== null,
  );

  if (resources.length !== rawResources.length) {
    return null;
  }

  if (resources.length === 0) {
    return null;
  }

  return {
    id: stringValue(value.id, 160) || createId("section"),
    title,
    isOpen: value.isOpen === true,
    resources,
  };
}

export function parseLevelInput(value: unknown):
  | { data: LevelInput }
  | { error: string } {
  if (!isRecord(value)) {
    return { error: "Invalid level details." };
  }

  const title = stringValue(value.title, 120);

  if (!title) {
    return { error: "Level title is required." };
  }

  const rawSections = Array.isArray(value.sections) ? value.sections : [];
  const sections = rawSections.map(normaliseSection).filter(
    (section): section is LevelSection => section !== null,
  );

  if (sections.length !== rawSections.length) {
    return {
      error:
        "Every section needs a title, and every uploaded resource needs a file.",
    };
  }

  return {
    data: {
      title,
      description: stringValue(value.description, 600),
      isOpen: value.isOpen === true,
      sections,
    },
  };
}

export function normaliseStoredLevel(id: string, value: unknown): Level {
  const parsed = isRecord(value) ? parseLevelInput({
    title: value.title,
    description: value.description,
    isOpen: value.isOpen,
    sections: value.sections,
  }) : { error: "Invalid level" };

  const record = isRecord(value) ? value : {};

  if ("data" in parsed) {
    return {
      id,
      order: typeof record.order === "number" ? record.order : 0,
      ...parsed.data,
    };
  }

  return {
    id,
    title: stringValue(record.title, 120) || "Untitled level",
    description: stringValue(record.description, 600),
    isOpen: record.isOpen === true,
    order: typeof record.order === "number" ? record.order : 0,
    sections: [],
  };
}
