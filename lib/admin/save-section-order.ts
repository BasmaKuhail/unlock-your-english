import type { LevelSection } from "@/lib/admin/types";

export async function saveSectionOrder(
  levelId: string,
  sections: LevelSection[],
): Promise<LevelSection[]> {
  const orderedSections = [...sections]
    .sort((a, b) => a.order - b.order)
    .map((section, index) => ({
      ...section,
      order: index,
    }));
  
  
  const response = await fetch(
    `/api/admin/levels/${encodeURIComponent(levelId)}/sections/reorder`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sectionIds: orderedSections.map(
          (section) => section.id,
        ),
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ?? "Unable to save section order.",
    );
  }

  return orderedSections;
}