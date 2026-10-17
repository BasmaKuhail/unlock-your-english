import type { Metadata } from "next";

import { NotFoundScreen } from "@/components/error/not-found-screen";

export const metadata: Metadata = {
  title: "Page not found | UYE",
  description: "The page you requested could not be found.",
};

export default function NotFound() {
  return <NotFoundScreen />;
}
