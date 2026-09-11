import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Uye — English, made part of your day",
  description: "A focused English-learning experience for everyday confidence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
