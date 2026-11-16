export function ProgressBar({ completed, total, label }: { completed: number; total: number; label: string }) {
  const percent = total ? Math.round(completed / total * 100) : 0;
  return <div>
    <div className="mb-2 flex justify-between gap-4 text-xs font-medium text-ink/60"><span>{label}</span><span>{percent}%</span></div>
    <div role="progressbar" aria-label={label} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-brand/10">
      <div className="h-full rounded-full bg-brand transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${percent}%` }} />
    </div>
  </div>;
}
