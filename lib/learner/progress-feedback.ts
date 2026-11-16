import type { LearningLevel } from "./types";

export type ProgressFeedback = {
  kind: "success" | "level-complete" | "save-error" | "refresh-error";
  title: string;
  message: string;
};

export function completedSectionFeedback(level: LearningLevel | undefined, levelTitle: string, sectionTitle: string): ProgressFeedback {
  const levelComplete = !!level?.sections.length && level.sections.every((item) => item.state === "completed");
  const nextSection = level?.sections.find((item) => item.state === "available");
  return levelComplete
    ? { kind: "level-complete", title: "You completed your level!", message: `Amazing work! You’ve completed every section in ${levelTitle}.` }
    : { kind: "success", title: "Section complete!", message: nextSection ? `Great work! ${sectionTitle} is complete. Your next section, ${nextSection.title}, is ready.` : `Great work! ${sectionTitle} is complete. Your progress has been saved.` };
}
