import { AdminRoute } from "@/components/admin/admin-route";

export const metadata = {
  title: "Levels | UYE admin",
  description: "Manage UYE learning content.",
};

export default function AdminLevelsPage() {
  return <AdminRoute view="levels" />;
}
