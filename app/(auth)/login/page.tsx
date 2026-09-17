import type { Metadata } from "next";

import { LoginForm } from "@/components/login/login-form";
import { LoginShell } from "@/components/login/login-shell";

export const metadata: Metadata = {
  title: "Log in | Uye",
  description: "Log in to continue learning English with Uye.",
};

export default function LoginPage() {
  return <LoginShell><LoginForm /></LoginShell>;
}
