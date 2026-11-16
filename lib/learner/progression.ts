import type { LevelSection } from "@/lib/admin/types";

export type SectionState = "completed" | "available" | "locked";

/** A closed section remains a prerequisite; unpublished content cannot be skipped. */
export function getSectionStates(
  sections: Pick<LevelSection, "id" | "isOpen">[],
  completedIds: string[],
  levelAvailable: boolean,
): SectionState[] {
  const completed = new Set(completedIds);
  let prerequisitesComplete = true;
  return sections.map((section) => {
    const done = completed.has(section.id);
    const state: SectionState = !levelAvailable || !section.isOpen
      ? "locked"
      : done ? "completed" : prerequisitesComplete ? "available" : "locked";
    prerequisitesComplete = prerequisitesComplete && done;
    return state;
  });
}
