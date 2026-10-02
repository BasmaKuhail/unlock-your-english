"use client";

import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "@/lib/firebase/client";
import {
  clearLearnerSession,
  getLearnerSessionExpiry,
  LEARNER_SESSION_STORAGE_KEY,
} from "@/lib/auth/learner-session";

const LEARNER_EMAIL_DOMAIN = "@students.uye.local";
const MAX_TIMEOUT_MS = 2_147_483_647;

function isLearner(email: string | null) {
  return email?.toLowerCase().endsWith(LEARNER_EMAIL_DOMAIN) ?? false;
}

/**
 * Enforces the client-side 30-day learner-session window whenever Firebase
 * restores a persisted authentication state. Admin authentication is handled
 * separately by its HTTP-only session cookie and is not affected here.
 */
export function LearnerSessionGuard() {
  useEffect(() => {
    let expiryTimer: number | undefined;

    function clearExpiryTimer() {
      if (expiryTimer) {
        window.clearTimeout(expiryTimer);
        expiryTimer = undefined;
      }
    }

    function expireLearnerSession() {
      clearLearnerSession();
      void signOut(auth);
    }

    function scheduleExpiry(email: string) {
      clearExpiryTimer();

      const expiresAt = getLearnerSessionExpiry(email);

      if (!expiresAt) {
        expireLearnerSession();
        return;
      }

      expiryTimer = window.setTimeout(() => {
        // Timers are capped below, so re-check before expiring a long session.
        if (getLearnerSessionExpiry(email)) {
          scheduleExpiry(email);
          return;
        }

        expireLearnerSession();
      }, Math.min(expiresAt - Date.now(), MAX_TIMEOUT_MS));
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearExpiryTimer();

      if (!user || !isLearner(user.email)) {
        return;
      }

      scheduleExpiry(user.email ?? "");
    });

    function handleStorageEvent(event: StorageEvent) {
      if (event.key !== LEARNER_SESSION_STORAGE_KEY) {
        return;
      }

      const user = auth.currentUser;

      if (user && isLearner(user.email)) {
        scheduleExpiry(user.email ?? "");
      }
    }

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      clearExpiryTimer();
      window.removeEventListener("storage", handleStorageEvent);
      unsubscribe();
    };
  }, []);

  return null;
}
