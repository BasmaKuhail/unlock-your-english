"use client";

import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { AdminProfile } from "@/context/admin-context";
import { getLearnerSessionExpiry } from "@/lib/auth/learner-session";
import { auth } from "@/lib/firebase/client";

type Account = { name: string; role: "Learner" | "Admin" };

const HomeAccountContext = createContext<{ account: Account | null; isLoading: boolean } | null>(null);

export function HomeAccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let version = 0;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const currentVersion = ++version;
      const email = user?.email ?? "";

      if (user && email.toLowerCase().endsWith("@students.uye.local")) {
        setAccount(getLearnerSessionExpiry(email) ? {
          name: user.displayName?.trim() || email.split("@")[0].toUpperCase(),
          role: "Learner",
        } : null);
        setIsLoading(false);
        return;
      }

      // This endpoint verifies the existing HTTP-only admin session. No new
      // credentials or persistence are needed, even without a Firebase user.
      let nextAccount: Account | null = null;
      try {
        const response = await fetch("/api/admin/profile", { cache: "no-store" });
        if (response.ok) {
          const data: { admin: AdminProfile } = await response.json();
          nextAccount = {
            name: data.admin.displayName?.trim() || "Administrator",
            role: "Admin",
          };
        }
      } catch {
        // Keep sign-in available when the existing session cannot be verified.
      }

      if (currentVersion === version) {
        setAccount(nextAccount);
        setIsLoading(false);
      }
    });

    return () => {
      version++;
      unsubscribe();
    };
  }, []);

  return <HomeAccountContext.Provider value={{ account, isLoading }}>{children}</HomeAccountContext.Provider>;
}

export function useHomeAccount() {
  const context = useContext(HomeAccountContext);
  if (!context) throw new Error("useHomeAccount must be used inside HomeAccountProvider.");
  return context;
}
