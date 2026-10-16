export type AlertVariant = "error" | "success" | "hint" | "warning";

export type AdminAlert = {
  id: string;
  message: string;
  title?: string;
  variant: AlertVariant;
};

export type AdminNotification = AdminAlert & {
  createdAt: string;
};

export const ADMIN_NOTIFICATION_STORAGE_KEY = "uye.admin.notifications";
export const ADMIN_NOTIFICATION_EVENT = "uye:admin-notifications";

const emptyNotifications: AdminNotification[] = [];
let cachedStorageValue: string | null | undefined;
let cachedNotifications: AdminNotification[] = emptyNotifications;

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readAdminNotifications(): AdminNotification[] {
  if (!canUseStorage()) return emptyNotifications;

  try {
    const stored = window.localStorage.getItem(ADMIN_NOTIFICATION_STORAGE_KEY);
    if (stored === cachedStorageValue) return cachedNotifications;
    cachedStorageValue = stored;

    if (!stored) {
      cachedNotifications = emptyNotifications;
      return cachedNotifications;
    }

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      cachedNotifications = emptyNotifications;
      return cachedNotifications;
    }

    cachedNotifications = parsed.filter(
      (notification): notification is AdminNotification =>
        typeof notification === "object" &&
        notification !== null &&
        "id" in notification &&
        "message" in notification &&
        "variant" in notification &&
        "createdAt" in notification &&
        typeof notification.id === "string" &&
        typeof notification.message === "string" &&
        notification.variant === "success" &&
        typeof notification.createdAt === "string",
    );

    return cachedNotifications;
  } catch {
    cachedNotifications = emptyNotifications;
    return cachedNotifications;
  }
}

export function saveSuccessNotification(alert: Omit<AdminAlert, "id" | "variant">) {
  if (!canUseStorage()) return;

  const notification: AdminNotification = {
    ...alert,
    id: createId(),
    variant: "success",
    createdAt: new Date().toISOString(),
  };

  try {
    const notifications = [notification, ...readAdminNotifications()].slice(0, 20);
    window.localStorage.setItem(
      ADMIN_NOTIFICATION_STORAGE_KEY,
      JSON.stringify(notifications),
    );
    window.dispatchEvent(new Event(ADMIN_NOTIFICATION_EVENT));
  } catch {
    // An unavailable browser storage must not prevent a completed admin action.
  }
}

export function clearAdminNotifications() {
  if (!canUseStorage()) return;

  try {
    window.localStorage.removeItem(ADMIN_NOTIFICATION_STORAGE_KEY);
    window.dispatchEvent(new Event(ADMIN_NOTIFICATION_EVENT));
  } catch {
    // Signing out should continue even if local storage is unavailable.
  }
}
