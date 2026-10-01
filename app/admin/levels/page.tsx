import { AdminRoute } from "@/components/admin/admin-route";

export const metadata = {
  title: "Levels | Uye admin",
  description: "Manage Uye learning content.",
};

export default function AdminLevelsPage() {
  return <AdminRoute view="levels" />;
}
