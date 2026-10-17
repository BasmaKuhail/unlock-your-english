import { AdminRoute } from "@/components/admin/admin-route";

export const metadata = {
  title: "Admin dashboard | UYE",
  description: "Manage students and learning content for UYE.",
};

export default function AdminPage() {
  return <AdminRoute view="dashboard" />;
}
