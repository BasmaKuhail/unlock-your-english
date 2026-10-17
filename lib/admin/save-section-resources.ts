
import type {
  LevelResource,
  LevelSection,
} from "@/lib/admin/types";

type ResourceResponse = {
  resource: LevelResource;
};

async function resourceRequest(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  resource?: LevelResource,
): Promise<ResourceResponse | null> {
  const response = await fetch(url, {
    method,
    headers: resource
      ? { "Content-Type": "application/json" }
      : undefined,
    body: resource
      ? JSON.stringify(resource)
      : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? `Unable to ${method.toLowerCase()} resource.`,
    );
  }

  return method === "DELETE"
    ? null
    : (data as ResourceResponse);
}

export async function saveSectionResources(
  levelId: string,
  section: LevelSection,
  originalSection?: LevelSection,
): Promise<LevelResource[]> {
  const baseUrl =
    `/api/admin/levels/${encodeURIComponent(levelId)}` +
    `/sections/${encodeURIComponent(section.id)}/resources`;

  const originalResources =
    originalSection?.resources ?? [];

  const originalById = new Map(
    originalResources.map((resource) => [
      resource.id,
      resource,
    ]),
  );

  const savedResources: LevelResource[] = [];

  for (const resource of section.resources) {
    const original = originalById.get(resource.id);

    if (!original) {
      const result = await resourceRequest(
        baseUrl,
        "POST",
        resource,
      );

      if (!result) {
        throw new Error("Resource creation returned no data.");
      }

      savedResources.push(result.resource);
      continue;
    }

    const changed =
      JSON.stringify(resource) !==
      JSON.stringify(original);

    if (!changed) {
      savedResources.push(resource);
      continue;
    }

    const result = await resourceRequest(
      `${baseUrl}/${encodeURIComponent(resource.id)}`,
      "PATCH",
      resource,
    );

    if (!result) {
      throw new Error("Resource update returned no data.");
    }

    savedResources.push(result.resource);
  }

  // Delete only after successful creates and updates.
  const currentIds = new Set(
    section.resources.map((resource) => resource.id),
  );

  for (const original of originalResources) {
    if (!currentIds.has(original.id)) {
      await resourceRequest(
        `${baseUrl}/${encodeURIComponent(original.id)}`,
        "DELETE",
      );
    }
  }

  return savedResources;
}
