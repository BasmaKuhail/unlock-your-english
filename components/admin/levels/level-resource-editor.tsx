import { DocumentIcon, UploadIcon } from "@/components/admin/icons";
import type { LevelResource, ResourceType } from "@/lib/admin/types";

type LevelResourceEditorProps = {
  index: number;
  isUploading: boolean;
  onChange: (resource: LevelResource) => void;
  onRemove: () => void;
  onUpload: (file: File) => void;
  resource: LevelResource;
};

const resourceTypes: { value: ResourceType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "file", label: "File" },
  { value: "voice", label: "Voice" },
];

function changeResourceType(resource: LevelResource, type: ResourceType): LevelResource {
  if (type === "text") {
    return {
      id: resource.id,
      title: resource.title,
      type,
      content: "",
    };
  }

  return {
    id: resource.id,
    title: resource.title,
    type,
    fileName: "",
    storagePath: "",
    mimeType: "",
  };
}

export function LevelResourceEditor({
  index,
  isUploading,
  onChange,
  onRemove,
  onUpload,
  resource,
}: LevelResourceEditorProps) {
  const isText = resource.type === "text";

  return (
    <div className="rounded-xl border border-[#e8ebf1] bg-[#fbfcff] p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-bold text-ink/55">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#eaf0ff] text-[10px] text-brand">
            {index + 1}
          </span>
          Document {index + 1}
        </span>
        <button
          className="text-xs font-bold text-ink/42 transition hover:text-[#c14a4a]"
          onClick={onRemove}
          type="button"
        >
          Remove
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_150px]">
        <label>
          <span className="mb-1.5 block text-xs font-semibold text-ink/57">
            Document label
          </span>
          <input
            className="input"
            maxLength={160}
            onChange={(event) => onChange({ ...resource, title: event.target.value })}
            placeholder="For example, Lesson notes"
            value={resource.title}
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-semibold text-ink/57">
            Format
          </span>
          <select
            className="input"
            onChange={(event) =>
              onChange(
                changeResourceType(resource, event.target.value as ResourceType),
              )
            }
            value={resource.type}
          >
            {resourceTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isText ? (
        <label className="mt-3 block">
          <span className="mb-1.5 block text-xs font-semibold text-ink/57">
            Text content
          </span>
          <textarea
            className="min-h-28 w-full resize-y rounded-xl border border-[#e1e5ed] bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-4 focus:ring-brand/10"
            maxLength={50_000}
            onChange={(event) =>
              onChange({ ...resource, content: event.target.value })
            }
            placeholder="Write the learning material students should read."
            value={resource.content}
          />
        </label>
      ) : (
        <div className="mt-3 rounded-xl border border-dashed border-[#cfd7e7] bg-white p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eaf0ff] text-brand">
                {resource.type === "voice" ? <UploadIcon className="h-4 w-4" /> : <DocumentIcon className="h-4 w-4" />}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {resource.fileName || `No ${resource.type} selected`}
                </p>
                <p className="mt-0.5 text-xs text-ink/47">
                  {resource.type === "voice"
                    ? "Upload an audio recording (up to 20 MB)."
                    : "Upload a supporting file (up to 20 MB)."}
                </p>
              </div>
            </div>

            <label className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#eaf0ff] px-3.5 py-2.5 text-xs font-bold text-brand transition hover:bg-[#dce7ff]">
              {isUploading ? "Uploading…" : resource.fileName ? "Replace" : "Choose file"}
              <input
                accept={resource.type === "voice" ? "audio/*" : undefined}
                className="sr-only"
                disabled={isUploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onUpload(file);
                  event.currentTarget.value = "";
                }}
                type="file"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
