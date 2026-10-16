"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  ADMIN_NOTIFICATION_EVENT,
  ADMIN_NOTIFICATION_STORAGE_KEY,
  readAdminNotifications,
  type AdminNotification,
} from "@/lib/admin/alerts";

const emptyNotifications: AdminNotification[] = [];

export function useAdminNotifications() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    function onStorage(event: StorageEvent) {
      if (event.key === ADMIN_NOTIFICATION_STORAGE_KEY) onStoreChange();
    }

    window.addEventListener(ADMIN_NOTIFICATION_EVENT, onStoreChange);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(ADMIN_NOTIFICATION_EVENT, onStoreChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const getSnapshot = useCallback(() => readAdminNotifications(), []);

  return useSyncExternalStore(subscribe, getSnapshot, () => emptyNotifications);
}
