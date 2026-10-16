import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { AlertVariant } from "@/lib/admin/alerts";

type AlertProps = {
  children: ReactNode;
  className?: string;
  compact?: boolean;
  title?: string;
  variant: AlertVariant;
};

const styles: Record<AlertVariant, { icon: string; panel: string }> = {
  error: {
    icon: "!",
    panel: "border-[#f3c9c6] bg-[#fff4f3] text-[#a83631]",
  },
  success: {
    icon: "✓",
    panel: "border-[#bce7d2] bg-[#effbf5] text-[#17734c]",
  },
  hint: {
    icon: "i",
    panel: "border-[#cad9ff] bg-[#f1f5ff] text-[#2858ca]",
  },
  warning: {
    icon: "!",
    panel: "border-[#f0d998] bg-[#fff9e8] text-[#8b6714]",
  },
};

export function Alert({ children, className, compact = false, title, variant }: AlertProps) {
  const style = styles[variant];

  return (
    <div
      aria-live={variant === "error" || variant === "warning" ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-3 rounded-xl border text-sm",
        compact ? "px-3 py-2.5" : "px-4 py-3.5",
        style.panel,
        className,
      )}
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current/25 text-[11px] font-black leading-none">
        {style.icon}
      </span>
      <div className="min-w-0 leading-5">
        {title && <p className="font-bold">{title}</p>}
        <div className={title ? "mt-0.5" : "font-medium"}>{children}</div>
      </div>
    </div>
  );
}
