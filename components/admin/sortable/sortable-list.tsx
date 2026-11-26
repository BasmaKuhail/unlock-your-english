
"use client";

import type { ReactNode } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./sortable-item";

type SortableEntity = {
  id: string;
  title: string;
  order: number;
};

type SortableListProps<T extends SortableEntity> = {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    dragHandle: ReactNode,
  ) => ReactNode;
  className?: string;
  layout?: "grid" | "vertical";
  disabled?: boolean;
};

export function SortableList<T extends SortableEntity>({
  items,
  onReorder,
  renderItem,
  className,
  layout = "vertical",
  disabled = false,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (disabled || !over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex(
      (item) => item.id === active.id,
    );

    const newIndex = items.findIndex(
      (item) => item.id === over.id,
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedItems = arrayMove(
      items,
      oldIndex,
      newIndex,
    ).map((item, index) => ({
      ...item,
      order: index,
    }));

    onReorder(reorderedItems);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={
          layout === "grid"
            ? rectSortingStrategy
            : verticalListSortingStrategy
        }
      >
        <div className={className}>
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              id={item.id}
              label={item.title}
              disabled={disabled}
            >
              {(dragHandle) =>
                renderItem(item, index, dragHandle)
              }
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
