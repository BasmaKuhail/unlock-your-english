import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/lib/firebase/client";

type SignInAsAdminInput = {
  email: string;
  password: string;
};

export function signInAsAdmin({ email, password }: SignInAsAdminInput) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}
