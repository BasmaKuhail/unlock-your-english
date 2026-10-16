import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase/client";
import { clearAdminNotifications } from "@/lib/admin/alerts";

type SignInAsAdminInput = {
  email: string;
  password: string;
};

export function signInAsAdmin({
  email,
  password,
}: SignInAsAdminInput) {
  return signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
}

export async function signOutAdmin() {
  try {
    await fetch("/api/auth/admin-session", {
      method: "DELETE",
    });
  } finally {
    clearAdminNotifications();
    await signOut(auth);
  }
}
