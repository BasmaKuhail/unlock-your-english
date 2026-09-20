import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-session";

export const metadata = {
  title: "Admin dashboard | Uye",
  description: "Manage students and learning content for Uye.",
};

export default async function AdminPage() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
