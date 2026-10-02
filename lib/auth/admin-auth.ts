import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase/client";

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
    await signOut(auth);
  }
}