import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function GridIcon({ className, ...props }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32" {...props}><path d="M30 32h-10c-1.105 0-2-.895-2-2v-10c0-1.105.895-2 2-2h10c1.105 0 2 .895 2 2v10c0 1.105-.895 2-2 2Zm0-12h-10v10h10V20Zm0-6h-10c-1.105 0-2-.896-2-2V2c0-1.105.895-2 2-2h10c1.105 0 2 .895 2 2v10c0 1.104-.895 2-2 2Zm0-12h-10v10h10V2ZM12 32H2c-1.105 0-2-.895-2-2v-10c0-1.105.895-2 2-2h10c1.104 0 2 .895 2 2v10c0 1.105-.896 2-2 2Zm0-12H2v10h10V20Zm0-6H2c-1.105 0-2-.896-2-2V2c0-1.105.895-2 2-2h10c1.104 0 2 .895 2 2v10c0 1.104-.896 2-2 2Zm0-12H2v10h10V2Z" /></svg>;
}

export function UsersIcon({ className, ...props }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" {...props}><path d="M19 15c2.209 0 4 1.791 4 4v2h-2m-5-10.126A4 4 0 0 0 19 7a4 4 0 0 0-3-3.874M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 15h8c2.209 0 4 1.791 4 4v2H1v-2c0-2.209 1.791-4 4-4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function BookIcon({ className, ...props }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 32 32" {...props}><path d="M30 25c0 1.104-.927 1.656-2 2 0 0-5.443 1.515-11 2.977V5l11-3c1.104 0 2 .896 2 2v21Zm-15 2.998C9.538 26.53 4 25 4 25c-1.136-.312-2-.896-2-2V4c0-1.104.896-2 2-2l11 3v22.998ZM28 0S22.211 1.594 16.95 3c-.659.025-1.323 0-1.983 0C9.955 1.656 4 0 4 0 1.791 0 0 1.791 0 4v21c0 2.209 1.885 3.313 4 4 0 0 5.393 1.5 10.967 3h2.025C22.612 30.5 28 29 28 29c2.053-.531 4-1.791 4-4V4c0-2.209-1.947-4-4-4Z" /></svg>;
}

export function BellIcon({ className, ...props }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" {...props}><path d="M12 5.5A5 5 0 0 1 17 10.5v2.24c0 .489.18.962.505 1.328l1.276 1.435c.86.967.174 2.497-1.121 2.497H6.34c-1.294 0-1.98-1.53-1.121-2.497l1.276-1.435A2.005 2.005 0 0 0 7 12.74V10.5a5 5 0 0 1 5-5Zm0 0V3m-1 18h2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}

export function PlusIcon({ className, ...props }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" {...props}><path d="M4 12h16M12 4v16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}

export function SearchIcon({ className, ...props }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" {...props}><circle cx="10.8" cy="10.8" r="5.7" stroke="currentColor" strokeWidth="1.8" /><path d="m15.2 15.2 4.3 4.3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
}

export function MoreIcon({ className, ...props }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24" {...props}><circle cx="5" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="19" cy="12" r="1.3" /></svg>;
}

export function ArrowRightIcon({ className, ...props }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" {...props}><path d="M5 12h13m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

export function DocumentIcon({ className, ...props }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" {...props}><path d="M6.5 3.5h7l4 4v13h-11a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /><path d="M13.5 3.8v4h3.7M8 12h8m-8 3.5h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg>;
}

export function UploadIcon({ className, ...props }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" {...props}><path d="M12 15V4m-4 4 4-4 4 4M5 14.5v4A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>;
}

export function CloseIcon({ className, ...props }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" {...props}><path d="m6 6 12 12m0-12L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
}
