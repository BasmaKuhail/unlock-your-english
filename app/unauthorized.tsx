import type { Metadata } from "next";

import { ErrorScreen } from "@/components/error/error-screen";

export const metadata: Metadata = {
  title: "Sign in required | Uye",
  description: "Sign in to continue to this page.",
};

export default function Unauthorized() {
  return (
    <ErrorScreen
      actionHref="/login"
      actionLabel="Log in"
      code="401"
      label="Sign in required"
      message="Please sign in before continuing to this page."
    />
  );
}
