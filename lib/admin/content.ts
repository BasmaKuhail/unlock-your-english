import type { AdminNavigationItem, AdminView } from "@/lib/admin/types";

export const adminPaths = {
  dashboard: "/admin",
  students: "/admin/students",
  levels: "/admin/levels",
  profile: "/admin/profile",
} as const;

export const adminPageLabels: Record<AdminView, string> = {
  dashboard: "Dashboard",
  students: "Students",
  levels: "Levels",
  profile: "Profile",
};

export const adminNavigation: AdminNavigationItem[] = [
  { label: "Dashboard", value: "dashboard", icon: "grid", href: adminPaths.dashboard },
  { label: "Students", value: "students", icon: "users", href: adminPaths.students },
  { label: "Levels", value: "levels", icon: "book", href: adminPaths.levels },
];

export const dashboardCopy = {
  eyebrow: "Overview",
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
