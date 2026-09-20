import type { Metadata } from "next";

import { ErrorScreen } from "@/components/error/error-screen";

export const metadata: Metadata = {
  title: "Page not found | Uye",
  description: "The page you requested could not be found.",
};

export default function NotFound() {
  return (
    <ErrorScreen
      actionHref="/"
      actionLabel="Back home"
      code="404"
      label="Page not found"
      message="The page you are looking for is not here."
    />
  );
}
