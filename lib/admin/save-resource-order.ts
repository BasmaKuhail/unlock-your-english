import type { LevelResource } from "@/lib/admin/types";

export async function saveResourceOrder(
  levelId: string,
  sectionId: string,
  resources: LevelResource[],
): Promise<LevelResource[]> {
  const orderedResources = resources.map(
    (resource, index) => ({
      ...resource,
      order: index,
    }),
  );

  const response = await fetch(
    `/api/admin/levels/${encodeURIComponent(levelId)}/sections/${encodeURIComponent(sectionId)}/resources/reorder`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resourceIds: orderedResources.map(
          (resource) => resource.id,
        ),
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Unable to save resource order.",
    );
  }

  return orderedResources;
}