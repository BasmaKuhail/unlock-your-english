export type AdminView = "dashboard" | "students" | "levels" | "profile";

export type AdminProfile = {
  name: string;
  email: string;
  initials: string;
  role: "Administrator";
};

export type StudentStatus = "Active" | "Frozen";
export type StudentFilter = "All" | StudentStatus;


export type ResourceType =
  | "text"
  | "link"
  | "file"
  | "voice";

type ResourceBase = {
  id: string;
  title: string;
  order: number;
};

export type TextResource = ResourceBase & {
  type: "text";
  content: string;
};

export type LinkResource = ResourceBase & {
  type: "link";
  url: string;
};

export type FileResource = ResourceBase & {
  type: "file";
  fileName: string;
  storagePath: string;
  mimeType: string;
  size: number;
};

export type VoiceResource = ResourceBase & {
  type: "voice";
  fileName: string;
  storagePath: string;
  mimeType: string;
  size: number;
};


export type LevelResource =
  | TextResource
  | LinkResource
  | FileResource
  | VoiceResource;


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
