import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin-auth/admin-login-form";
import { AdminLoginShell } from "@/components/admin-auth/admin-login-shell";

export const metadata: Metadata = {
  title: "Admin sign in | UYE",
  description: "Sign in to administer Uye learners and learning content.",
};

export default function AdminLoginPage() {
  return (
    <AdminLoginShell>
      <AdminLoginForm />
    </AdminLoginShell>
  );
}
