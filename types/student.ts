export type Student = {
  uid: string; // Firebase UID — internal
  studentId: string; // UYE-0001 — learner-facing ID
  name: string;
  level: string | null;
  levelId: string | null;
  levelOpen: boolean;
  status: "Active" | "Frozen";
  progress: 0;
  // UI-only presentation data
  initials: string;
  tone: string;
};
