
import type {
  Level,
  LevelResource,
  LevelSection,
} from "@/lib/admin/types";
import { createId } from "./levels";

type LevelInput = Pick<
  Level,
  "title" | "description" | "isOpen" | "sections"
>;

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function stringValue(
  value: unknown,
  maximumLength: number,
) {
  return typeof value === "string"
    ? value.trim().slice(0, maximumLength)
    : "";
}

function normaliseResource(
  value: unknown,
): LevelResource | null {
  if (!isRecord(value)) {
    return null;
  }

  const type = value.type;
  const title = stringValue(value.title, 160);
  const id =
    stringValue(value.id, 160) ||
    createId("resource");

  const order =
    typeof value.order === "number" &&
    Number.isInteger(value.order) &&
    value.order >= 0
      ? value.order
      : 0;

  if (type === "text") {
    return {
      id,
      title: title || "Text document",
      type: "text",
      content: stringValue(value.content, 50_000),
      order,
    };
  }

  if (type === "link") {
    const url = stringValue(value.url, 2048);

    try {
      const parsedUrl = new URL(url);

      if (
        parsedUrl.protocol !== "https:" &&
        parsedUrl.protocol !== "http:"
      ) {
        return null;
      }
    } catch {
      return null;
    }

    return {
      id,
      title: title || "External link",
      type: "link",
      url,
      order,
    };
  }

  if (type !== "file" && type !== "voice") {
    return null;
  }

  const fileName = stringValue(
    value.fileName,
    255,
  );

  const storagePath = stringValue(
    value.storagePath,
    500,
  );

  const mimeType = stringValue(
    value.mimeType,
    150,
  );

  const size =
    typeof value.size === "number" &&
    Number.isFinite(value.size) &&
    value.size >= 0
      ? value.size
      : 0;

  if (!fileName || !storagePath) {
    return null;
  }

  return {
    id,
    title: title || fileName,
    type,
    fileName,
    storagePath,
    mimeType,
    size,
    order,
  };
}

function normaliseSection(
  value: unknown,
): LevelSection | null {
  if (!isRecord(value)) {
    return null;
  }

  const title = stringValue(
    value.title,
    160,
  );

  if (!title) {
    return null;
  }

  const rawResources = Array.isArray(
    value.resources,
  )
    ? value.resources
    : [];

  const resources = rawResources
    .map(normaliseResource)
    .filter(
      (resource): resource is LevelResource =>
        resource !== null,
    );

  if (resources.length !== rawResources.length) {
    return null;
  }

  if (resources.length === 0) {
    return null;
  }

  return {
    id:
      stringValue(value.id, 160) ||
      createId("section"),
    title,
    order:
      typeof value.order === "number" &&
      Number.isInteger(value.order) &&
      value.order >= 0
        ? value.order
        : 0,
    isOpen: value.isOpen === true,
    resources,
  };
}

export function parseLevelInput(
  value: unknown,
):
  | { data: LevelInput }
  | { error: string } {
  if (!isRecord(value)) {
    return {
      error: "Invalid level details.",
    };
  }

  const title = stringValue(
    value.title,
    120,
  );

  if (!title) {
    return {
      error: "Level title is required.",
    };
  }

  const rawSections = Array.isArray(
    value.sections,
  )
    ? value.sections
    : [];

  const sections = rawSections
    .map(normaliseSection)
    .filter(
      (section): section is LevelSection =>
        section !== null,
    );

  if (sections.length !== rawSections.length) {
    return {
      error:
        "Every section needs a title and at least one valid resource. Links need valid URLs, and uploaded resources need files.",
    };
  }

  return {
    data: {
      title,
      description: stringValue(
        value.description,
        600,
      ),
      isOpen: value.isOpen === true,
      sections,
    },
  };
}

export function normaliseStoredLevel(
  id: string,
  value: unknown,
): Level {
  const record = isRecord(value)
    ? value
    : {};

  const parsed = parseLevelInput({
    title: record.title,
    description: record.description,
    isOpen: record.isOpen,
    sections: record.sections,
  });

  if ("data" in parsed) {
    return {
      id,
      order:
        typeof record.order === "number"
          ? record.order
          : 0,
      ...parsed.data,
    };
  }

  return {
    id,
    title:
      stringValue(record.title, 120) ||
      "Untitled level",
    description: stringValue(
      record.description,
      600,
    ),
    isOpen: record.isOpen === true,
    order:
      typeof record.order === "number"
        ? record.order
        : 0,
    sections: [],
  };
}
