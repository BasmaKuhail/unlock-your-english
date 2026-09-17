import type { ReactNode } from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-ink/62">{label}</span>{children}</label>;
}
