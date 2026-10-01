import Image from "next/image";

import adminAvatar from "@/public/body-gard.png";
import { cn } from "@/lib/cn";

export function AdminAvatar({ className }: { className?: string }) {
  return (
    <Image
      alt="Administrator avatar"
      className={cn(
        "bg-[#e5edff] object-cover object-[50%_35%]",
        className,
      )}
      height={80}
      sizes="80px"
      src={adminAvatar}
      width={80}
    />
  );
}
