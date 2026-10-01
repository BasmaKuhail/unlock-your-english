import { AdminRoute } from "@/components/admin/admin-route";

export const metadata = {
  title: "Admin profile | Uye",
  description: "View your Uye administrator profile.",
};

export default function AdminProfileRoutePage() {
  return <AdminRoute view="profile" />;
}
