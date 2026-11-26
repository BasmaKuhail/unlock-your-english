"use client";

import { useId, useState } from "react";

export function useCollapsible(defaultExpanded = false) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentId = useId();

  return {
    contentId,
    isExpanded,
    toggle: () => setIsExpanded((expanded) => !expanded),
  };
}

type CollapseToggleProps = {
  contentId: string;
  isExpanded: boolean;
  label: string;
  onToggle: () => void;
};

export function CollapseToggle({ contentId, isExpanded, label, onToggle }: CollapseToggleProps) {
  return (
    <button
      aria-controls={contentId}
      aria-expanded={isExpanded}
      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${label}`}
      className="rounded-lg p-2 text-ink/60 transition hover:bg-[#f2f4f8] hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      onClick={onToggle}
      type="button"
    >
      <svg aria-hidden="true" className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24">
        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </button>
  );
}
