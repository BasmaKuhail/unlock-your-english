import { ArrowRightIcon } from "@/components/ui/icons";
import { homeContent } from "@/content/home";

import { SectionEyebrow } from "./section-eyebrow";

export function ContactSection() {
  const { contact } = homeContent;

  return (
    <section className="scroll-mt-8 border-t border-line bg-[#f8faff] py-20 sm:py-28" id="contact">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{contact.eyebrow}</SectionEyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-ink sm:text-5xl">{contact.title}</h2>
          <p className="mt-5 text-base leading-7 text-ink/60 sm:text-lg sm:leading-8">{contact.description}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contact.channels.map((channel) => (
            <a
              className="group rounded-[1.6rem] border border-line bg-white p-6 shadow-[0_10px_26px_rgba(1,14,54,0.035)] transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_18px_38px_rgba(1,14,54,0.08)] sm:p-7"
              href={channel.href}
              key={channel.label}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/[0.08] text-brand">
                {channel.icon === "whatsapp" ? <WhatsAppIcon /> : channel.icon === "instagram" ? <InstagramIcon /> : <MailIcon />}
              </span>
              <h3 className="mt-7 text-2xl font-semibold tracking-[-0.04em] text-ink">{channel.label}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/60">{channel.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink transition-colors group-hover:text-brand">
                {channel.action}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <rect height="17" rx="4.5" stroke="currentColor" strokeWidth="1.8" width="17" x="3.5" y="3.5" />
      <circle cx="12" cy="12" r="3.7" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.8" fill="currentColor" r="1" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M19.3 4.7A9.8 9.8 0 0 0 3.6 16.4L2.5 21.5l5.2-1.1a9.8 9.8 0 0 0 11.6-15.7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M8.5 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.3 0 .5.5.9 1.4 1.8 2.4 2.3.2.1.3.1.5 0l.8-.9c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5v.5c0 .3-.1.5-.4.7-.5.3-1.2.4-1.8.2-1.3-.4-2.7-1.4-4-2.6-1.1-1.1-2.1-2.5-2.5-3.8-.2-.7-.1-1.3.1-1.8Z" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.7" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <rect height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" width="18" x="3" y="4.5" />
      <path d="m4 6 8 6.2L20 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
