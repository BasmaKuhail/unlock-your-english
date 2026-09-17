import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Unlock Your English | UYE",
  description:
    "A free, level-based English programme combining self-learning, interactive activities, and ongoing support.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
