export type AdminView = "dashboard" | "students" | "levels" | "profile";

export type AdminProfile = {
  name: string;
  email: string;
  initials: string;
  role: "Administrator";
};

export type StudentStatus = "Active" | "Frozen";
export type StudentFilter = "All" | StudentStatus;

export type ResourceType = "text" | "file" | "voice";

type BaseResource = {
  id: string;
  title: string;
};

export type TextResource = BaseResource & {
  type: "text";
  content: string;
};

export type UploadedResource = BaseResource & {
  type: "file" | "voice";
  fileName: string;
  storagePath: string;
  mimeType: string;
};

export type LevelResource = TextResource | UploadedResource;


export type LevelSection = {
  id: string;
  title: string;
  order: number;
  isOpen: boolean;
  resources: LevelResource[];
};

export type Level = {
  id: string;
  title: string;
  description: string;
  isOpen: boolean;
  order: number;
  sections: LevelSection[];
};
export type AdminNavigationItem = {
  label: string;
  value: AdminView;
  icon: "grid" | "users" | "book";
  href: string;
};
