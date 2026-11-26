import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function WhatsAppIcon({ className, ...props }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M19.3 4.7A9.8 9.8 0 0 0 3.6 16.4L2.5 21.5l5.2-1.1a9.8 9.8 0 0 0 11.6-15.7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M8.5 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.3 0 .5.5.9 1.4 1.8 2.4 2.3.2.1.3.1.5 0l.8-.9c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5v.5c0 .3-.1.5-.4.7-.5.3-1.2.4-1.8.2-1.3-.4-2.7-1.4-4-2.6-1.1-1.1-2.1-2.5-2.5-3.8-.2-.7-.1-1.3.1-1.8Z" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.7" />
    </svg>
  );
}

export function ArrowRightIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="M2.75 8h10.5M8.75 3.5 13.25 8l-4.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function CheckIcon({ className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        d="m3.5 8.25 2.8 2.8L12.5 4.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
