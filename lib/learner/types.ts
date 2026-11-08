import type { LevelResource } from "@/lib/admin/types";
import type { SectionState } from "./progression";

export type LearningSection = {
  id: string;
  title: string;
  state: SectionState;
  resources: LevelResource[];
};

export type LearningLevel = {
  id: string;
  title: string;
  description: string;
  isCurrent: boolean;
  available: boolean;
  sections: LearningSection[];
};

export type LearnerDashboardData = {
  student: { name: string; studentId: string };
  levels: LearningLevel[];
};
