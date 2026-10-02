import { AdminRoute } from "@/components/admin/admin-route";

export const metadata = {
  title: "Admin dashboard | Uye",
  description: "Manage students and learning content for Uye.",
};

export default function AdminPage() {
  return <AdminRoute view="dashboard" />;
}
