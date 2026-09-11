import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

type ButtonProps = ComponentProps<"a"> & {
  variant?: "primary" | "text";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center gap-2 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand",
        variant === "primary" &&
          "rounded-full bg-brand px-5 py-3.5 text-white shadow-[0_10px_24px_rgba(58,112,255,0.22)] hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_14px_28px_rgba(58,112,255,0.28)]",
        variant === "text" &&
          "group rounded-full px-2 py-3 text-ink hover:text-brand",
        className,
      )}
      {...props}
    />
  );
}
