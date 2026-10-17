import { AdminRoute } from "@/components/admin/admin-route";

export const metadata = {
  title: "Admin profile | UYE",
  description: "View your UYE administrator profile.",
};

export default function AdminProfileRoutePage() {
  return <AdminRoute view="profile" />;
}
