import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { redirect } from "next/navigation";
import { getAdminProfile, getAdminSession } from "@/lib/auth/admin-session";

export const metadata = {
  title: "Admin dashboard | Uye",
  description: "Manage students and learning content for Uye.",
};

export default async function AdminPage() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  const adminProfile = await getAdminProfile(admin);

  return <AdminDashboard adminProfile={adminProfile} />;
}
