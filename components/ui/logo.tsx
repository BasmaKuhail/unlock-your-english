import Link from "next/link";

import { cn } from "@/lib/cn";

type LogoProps = {
  label: string;
  className?: string;
};

export function Logo({ label, className }: LogoProps) {
  return (
    <Link
      aria-label={`${label} home`}
      className={cn("text-[1.7rem] font-black tracking-[-0.09em] text-ink", className)}
      href="/"
    >
      {label}
    </Link>
  );
}
