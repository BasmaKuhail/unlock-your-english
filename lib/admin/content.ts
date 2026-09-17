import type { AdminNavigationItem } from "@/lib/admin/types";

export const adminProfile = {
  initials: "HA",
  name: "Hana Abu Rashed",
  role: "Administrator",
} as const;

export const adminNavigation: AdminNavigationItem[] = [
  { label: "Dashboard", value: "dashboard", icon: "grid" },
  { label: "Students", value: "students", icon: "users" },
  { label: "Levels", value: "levels", icon: "book" },
];

export const dashboardCopy = {
  eyebrow: "Overview",
  title: "Welcome back, Hana.",
  description: "Here's what's happening with your learners.",
  studentActivity: {
    title: "Student activity",
    description: "Progress across active learners",
  },
  levelsAtAGlance: {
    title: "Levels at a glance",
    description: "Active learning paths",
  },
  recentStudents: {
    title: "Recent students",
    description: "Newest updates from your learners",
  },
} as const;

export const activityChart = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 56 },
  { day: "Wed", value: 47 },
  { day: "Thu", value: 73 },
  { day: "Fri", value: 64 },
  { day: "Sat", value: 90 },
  { day: "Sun", value: 78 },
] as const;

export const levelProgress = [74, 92, 61, 38] as const;

export const studentCopy = {
  eyebrow: "People",
  title: "Students",
  addButton: "Add student",
  searchPlaceholder: "Search by name, ID, or email",
  noResults: "No students match your search.",
} as const;

export const levelCopy = {
  eyebrow: "Learning content",
  title: "Levels",
  addButton: "Add level",
  description:
    "Build each learning path from clear, focused content sections. Every section has a title and supporting document for students.",
} as const;
