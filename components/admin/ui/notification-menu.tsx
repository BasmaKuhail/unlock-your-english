"use client";

import { useState } from "react";

import { BellIcon } from "@/components/admin/icons";
import { Alert } from "@/components/admin/ui/alert";
import { useAdminNotifications } from "@/hooks/use-admin-notifications";

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime())
    ? "Just now"
    : new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
}

export function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useAdminNotifications();

  return (
    <div className="relative">
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Notifications${notifications.length ? ` (${notifications.length})` : ""}`}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/55 transition hover:bg-[#f3f5fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <BellIcon className="h-5 w-5" />
        {notifications.length > 0 && <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-brand" />}
      </button>

      {isOpen && (
        <div aria-label="Saved notifications" className="absolute right-0 top-12 z-40 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-[#dce3f1] bg-white p-3 shadow-[0_18px_45px_rgba(1,14,54,0.16)]" role="dialog">
          <div className="flex items-baseline justify-between gap-3 px-1 pb-3">
            <h2 className="text-sm font-bold">Notifications</h2>
            <span className="text-xs text-ink/45">{notifications.length} saved</span>
          </div>
          {notifications.length > 0 ? (
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {notifications.map((notification) => (
                <div key={notification.id}>
                  <Alert compact title={notification.title} variant="success">
                    {notification.message}
                  </Alert>
                  <p className="px-1 pt-1 text-[11px] text-ink/40">
                    {formatTimestamp(notification.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-[#f7f9fe] px-4 py-5 text-center text-sm text-ink/50">
              Successful actions will appear here.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
