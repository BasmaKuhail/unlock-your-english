import type { Metadata } from "next";

import { ErrorScreen } from "@/components/error/error-screen";

export const metadata: Metadata = {
  title: "Access denied | Uye",
  description: "You do not have permission to view this page.",
};

export default function Forbidden() {
  return (
    <ErrorScreen
      actionHref="/"
      actionLabel="Back home"
      code="403"
      label="Forbidden"
      message="You do not have permission to view this page."
    />
  );
}
