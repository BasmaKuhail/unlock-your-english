"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase/client";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      const response = await fetch("/api/auth/admin-session/logout", { method: "POST" });

      if (!response.ok) {
        throw new Error("Unable to clear admin session.");
      }

      await signOut(auth);
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setIsSigningOut(false);
    }
  }

  return (
    <button
      className="inline-flex items-center justify-center rounded-lg border border-[#dfe4ee] px-3 py-2 text-sm font-bold text-ink/65 transition hover:border-brand/30 hover:bg-[#f3f6ff] hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isSigningOut}
      onClick={handleSignOut}
      type="button"
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
