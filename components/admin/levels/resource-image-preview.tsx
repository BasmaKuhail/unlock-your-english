
"use client";

import { useEffect, useState } from "react";

type ResourceImagePreviewProps = {
  levelId: string;
  sectionId: string;
  resourceId: string;
  storagePath: string;
};

export function ResourceImagePreview({
  levelId,
  sectionId,
  resourceId,
  storagePath,
}: ResourceImagePreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPreview() {
      setIsLoading(true);
      setImageUrl(null);
      setError("");

      try {
        const response = await fetch(
          `/api/admin/levels/${encodeURIComponent(levelId)}` +
            `/sections/${encodeURIComponent(sectionId)}` +
            `/resources/${encodeURIComponent(resourceId)}/preview`,
          { signal: controller.signal },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ?? "Unable to load image preview.",
          );
        }

        if (!controller.signal.aborted) {
          setImageUrl(data.url);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load image preview.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadPreview();

    return () => controller.abort();
  }, [levelId, sectionId, resourceId, storagePath]);

  if (isLoading) {
    return (
      <div className="mt-3 rounded-xl bg-[#f2f4f8] p-6 text-center text-sm text-ink/50">
        Loading image preview…
      </div>
    );
  }

  if (error) {
    return (
      <p role="alert" className="mt-3 text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[#e8ebf1] bg-white p-3">
      {/* Signed B2 URL: use a native img to avoid Next.js image
          optimisation proxying or remote host configuration. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Uploaded learning resource"
        className="max-h-72 w-full rounded-lg object-contain"
        src={imageUrl}
      />
    </div>
  );
}
