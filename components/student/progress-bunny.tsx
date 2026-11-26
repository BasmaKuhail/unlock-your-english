import Image from "next/image";

type ProgressBunnyProps = {
  completed: number;
  total: number;
  className?: string;
};

export function ProgressBunny({ completed, total, className }: ProgressBunnyProps) {
  const progress = total > 0 ? completed / total : 0;
  const src = progress >= 0.75
    ? "/images/bunny/wow.png"
    : progress >= 0.35
      ? "/images/bunny/confident.png"
      : "/images/bunny/pointing.png";

  return <Image src={src} alt="" width={320} height={320} className={className} />;
}
