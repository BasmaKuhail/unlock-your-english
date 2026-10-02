import { AdminRoute } from "@/components/admin/admin-route";

export const metadata = {
  title: "Students | Uye admin",
  description: "Manage Uye learners.",
};

export default function AdminStudentsPage() {
  return <AdminRoute view="students" />;
}
