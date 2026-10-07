import { PlusIcon } from "@/components/admin/icons";
import { LevelResourceEditor } from "@/components/admin/levels/level-resource-editor";
import { Toggle } from "@/components/admin/ui/toggle";
import { createTextResource, createUploadedResource } from "@/lib/admin/levels";
import type { LevelResource, LevelSection } from "@/lib/admin/types";

type LevelSectionCardProps = {
  index: number;
  onChange: (section: LevelSection) => void;
  onRemove: () => void;
  onUpload: (resourceId: string, file: File) => void;
  section: LevelSection;
  uploadingResourceId: string | null;
};

export function LevelSectionCard({
  index,
  onChange,
  onRemove,
  onUpload,
  section,
  uploadingResourceId,
}: LevelSectionCardProps) {
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

  function addResource(type: "text" | "file" | "voice") {
    const resource = type === "text" ? createTextResource() : createUploadedResource(type);
    onChange({ ...section, resources: [...section.resources, resource] });
  }

  return (
    <article className="rounded-2xl border border-[#e1e5ed] bg-white p-4 shadow-[0_10px_25px_rgba(1,14,54,0.025)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#edf0f5] pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf0ff] text-xs font-bold text-brand">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-bold">Section {index + 1}</p>
            <p className="mt-0.5 text-xs text-ink/47">Group related learning documents.</p>
          </div>
        </div>
        <button
          className="rounded-lg px-2 py-1.5 text-xs font-bold text-ink/42 transition hover:bg-[#fff3f3] hover:text-[#c14a4a]"
          onClick={onRemove}
          type="button"
        >
          Remove section
        </button>
      </div>

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
        {section.resources.map((resource, resourceIndex) => (
          <LevelResourceEditor
            index={resourceIndex}
            isUploading={uploadingResourceId === resource.id}
            key={resource.id}
            onChange={(nextResource) => updateResource(resource.id, nextResource)}
            onRemove={() => removeResource(resource.id)}
            onUpload={(file) => onUpload(resource.id, file)}
            resource={resource}
          />
        ))}
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
      </div>
    </article>
  );
}
