import type { Metadata } from "next";

import { LearnerSessionGuard } from "@/components/auth/learner-session-guard";

import "./globals.css";

export const metadata: Metadata = {
  title: "Uye — English, made part of your day",
  description: "A focused English-learning experience for everyday confidence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <LearnerSessionGuard />
        {children}
      </body>
    </html>
  );
}
