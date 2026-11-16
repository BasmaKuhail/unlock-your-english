import type { Metadata } from "next";
import { StudentDashboard } from "@/components/student/student-dashboard";

export const metadata: Metadata = { title: "My learning journey | UYE", description: "Your English learning journey, one section at a time." };

export default function StudentDashboardPage() {
  return <StudentDashboard />;
}
