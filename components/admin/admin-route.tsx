import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminProfilePage } from "@/components/admin/admin-profile-page";
import { getAdminProfile, getAdminSession } from "@/lib/auth/admin-session";
import type { AdminView } from "@/lib/admin/types";

export async function AdminRoute({ view }: { view: AdminView }) {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  if (view === "profile") {
    return <AdminProfilePage />;
  }

  const adminProfile = await getAdminProfile(admin);

  return <AdminDashboard adminProfile={adminProfile} view={view} />;
}
