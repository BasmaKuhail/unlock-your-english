import { AdminRoute } from "@/components/admin/admin-route";

export const metadata = {
  title: "Students | UYE admin",
  description: "Manage UYE learners.",
};

export default function AdminStudentsPage() {
  return <AdminRoute view="students" />;
}
