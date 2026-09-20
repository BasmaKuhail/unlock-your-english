"use client";

import { ErrorScreen } from "@/components/error/error-screen";
export default function ErrorPage() {
  return (
    <ErrorScreen
      actionHref="/"
      actionLabel="Back home"
      code="500"
      label="Something went wrong"
      message="Something went wrong while loading this page."
    />
  );
}
