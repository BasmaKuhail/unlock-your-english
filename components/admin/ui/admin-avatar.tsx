import Image from "next/image";

import adminAvatar from "@/public/adminProfile.png";
import { cn } from "@/lib/cn";

export function AdminAvatar({ className }: { className?: string }) {
  return (
    <Image
      alt="Administrator avatar"
      className={cn(
        "bg-[#9edcff] object-cover object-center",
        className,
      )}
      height={80}
      sizes="80px"
      src={adminAvatar}
      width={80}
    />
  );
}
