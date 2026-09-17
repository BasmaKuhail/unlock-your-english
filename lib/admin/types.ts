export type AdminView = "dashboard" | "students" | "levels";

export type StudentStatus = "Active" | "Frozen";
export type StudentFilter = "All" | StudentStatus;

export type Student = {
  uid: string;
  name: string;
  email: string;
  password: string;
  level: string;
  progress: number;
  status: StudentStatus;
  levelOpen: boolean;
  initials: string;
  tone: string;
};

export type ContentSection = {
  id: number;
  title: string;
  document: string;
};

export type Level = {
  id: number;
  title: string;
  description: string;
  students: number;
  sections: ContentSection[];
};

export type AdminNavigationItem = {
  label: string;
  value: AdminView;
  icon: "grid" | "users" | "book";
};
