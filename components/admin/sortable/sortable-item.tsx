"use client";

import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableItemProps = {
  id: string;
  label: string;
  disabled?: boolean;
  children: (dragHandle: ReactNode) => ReactNode;
};

export function SortableItem({
  id,
  label,
  disabled = false,
  children,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const dragHandle = (
    <button
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label={`Reorder ${label}`}
      disabled={disabled}
      type="button"
      className="inline-flex h-9 w-9 touch-none cursor-grab items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-[#edf2ff] hover:text-brand active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        {[6, 12, 18].map((y) => (
          <g key={y}>
            <circle cx="9" cy={y} r="1.5" />
            <circle cx="15" cy={y} r="1.5" />
          </g>
        ))}
      </svg>
    </button>
  );

  return (
    <div
        ref={setNodeRef}
        className="min-w-0 w-full"
        style={{
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.65 : 1,
            zIndex: isDragging ? 10 : undefined,
            position: "relative",
        }}
        >
        {children(dragHandle)}
    </div>
  );
}
