import Image from "next/image";

export function BunnyGuide({ message }: { message: string }) {
  return <aside className="relative flex items-center gap-3 overflow-hidden rounded-3xl border border-brand/10 bg-[#eef3ff] p-5 sm:p-6" aria-label="Your bunny learning guide">
    <Image src="/big-bunny.png" alt="Your bunny learning companion" width={100} height={120} className="h-28 w-24 shrink-0 object-contain" />
    <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-brand">A little bunny encouragement</p><p className="text-sm leading-6 text-ink/75">{message}</p></div>
  </aside>;
}
