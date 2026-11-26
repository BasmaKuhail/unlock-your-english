import { PlusIcon } from "@/components/admin/icons";
import { LevelResourceEditor } from "@/components/admin/levels/level-resource-editor";
import { Toggle } from "@/components/admin/ui/toggle";
import { CollapseToggle, useCollapsible } from "@/components/admin/ui/collapse-toggle";
import { createTextResource, createUploadedResource } from "@/lib/admin/levels";
import type { LevelResource, LevelSection } from "@/lib/admin/types";
import { type ReactNode } from "react";
import { SortableList } from "@/components/admin/sortable/sortable-list";

type LevelSectionCardProps = {
  levelId: string;
  index: number;
  onChange: (section: LevelSection) => void;
  onRemove: () => void;
  onUpload: (resourceId: string, file: File) => void;
  section: LevelSection;
  uploadingResourceId: string | null;
  dragHandle?: ReactNode;
};

export function LevelSectionCard({
  index,
  onChange,
  onRemove,
  onUpload,
  section,
  uploadingResourceId,
  levelId,
  dragHandle,
}: LevelSectionCardProps) {
  const { contentId, isExpanded, toggle } = useCollapsible(!section.title.trim());

  function updateResource(resourceId: string, resource: LevelResource) {
    onChange({
      ...section,
      resources: section.resources.map((item) =>
        item.id === resourceId ? resource : item,
      ),
    });
  }

  function removeResource(resourceId: string) {
    onChange({
      ...section,
      resources: section.resources.filter((resource) => resource.id !== resourceId),
    });
  }

  function addResource(type: "text" | "file" | "voice" | "image") {
    const nextOrder =
      Math.max(-1, ...section.resources.map((resource) => resource.order)) + 1;

    const resource =
      type === "text"
        ? createTextResource()
        : createUploadedResource(type);

    onChange({
      ...section,
      resources: [
        ...section.resources,
        {
          ...resource,
          order: nextOrder,
        },
      ],
    });
  }
  function reorderResources(
    reorderedResources: LevelResource[],
  ) {
    onChange({
      ...section,
      resources: reorderedResources,
    });
  }

  return (
    <article className="rounded-2xl border border-[#e1e5ed] bg-white p-4 shadow-[0_10px_25px_rgba(1,14,54,0.025)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {dragHandle}
          <p className="min-w-0 break-words text-sm font-bold">{section.title.trim() || `Untitled section ${index + 1}`}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="rounded-lg px-2 py-1.5 text-xs font-bold text-ink/42 transition hover:bg-[#fff3f3] hover:text-[#c14a4a]"
            onClick={onRemove}
            type="button"
          >
            Remove section
          </button>
          <CollapseToggle contentId={contentId} isExpanded={isExpanded} label={section.title.trim() || `section ${index + 1}`} onToggle={toggle} />
        </div>
      </div>

      <div hidden={!isExpanded} id={contentId}>
      <div className="mt-4 border-t border-[#edf0f5]" />
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <label>
          <span className="mb-1.5 block text-xs font-semibold text-ink/57">Section title</span>
          <input
            className="input"
            maxLength={160}
            onChange={(event) => onChange({ ...section, title: event.target.value })}
            placeholder="For example, Greetings and introductions"
            value={section.title}
          />
        </label>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f9fe] px-3.5 py-3 lg:min-w-48">
          <div>
            <p className="text-xs font-bold">Section access</p>
            <p className="mt-0.5 text-[11px] text-ink/47">{section.isOpen ? "Open" : "Closed"}</p>
          </div>
          <Toggle
            checked={section.isOpen}
            label={`Toggle access for ${section.title || `section ${index + 1}`}`}
            onChange={() => onChange({ ...section, isOpen: !section.isOpen })}
          />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <SortableList
          items={section.resources}
          onReorder={reorderResources}
          layout="vertical"
          orderDirection="asc"
          className="mt-5 space-y-3"
          disabled={uploadingResourceId !== null}
          renderItem={(resource, resourceIndex, dragHandle) => (
            <LevelResourceEditor
              index={resourceIndex}
              dragHandle={dragHandle}
              isUploading={uploadingResourceId === resource.id}
              onChange={(nextResource) =>
                updateResource(resource.id, nextResource)
              }
              onRemove={() => removeResource(resource.id)}
              onUpload={(file) => onUpload(resource.id, file)}
              resource={resource}
              levelId={levelId}
              sectionId={section.id}
            />
          )}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[#edf0f5] pt-4">
        <button className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf0ff] px-3 py-2 text-xs font-bold text-brand hover:bg-[#dce7ff]" onClick={() => addResource("text")} type="button">
          <PlusIcon className="h-3.5 w-3.5" /> Text document
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-[#dfe5f2] px-3 py-2 text-xs font-bold text-ink/60 hover:bg-[#f6f8fc]" onClick={() => addResource("file")} type="button">
          <PlusIcon className="h-3.5 w-3.5" /> File
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-[#dfe5f2] px-3 py-2 text-xs font-bold text-ink/60 hover:bg-[#f6f8fc]" onClick={() => addResource("voice")} type="button">
          <PlusIcon className="h-3.5 w-3.5" /> Voice file
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-[#dfe5f2] px-3 py-2 text-xs font-bold text-ink/60 hover:bg-[#f6f8fc]" onClick={() => addResource("image")} type="button">
          <PlusIcon className="h-3.5 w-3.5" /> Image
        </button>
      </div>
      </div>
    </article>
  );
}
