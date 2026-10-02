import { useCallback, useState, type FormEvent } from "react";

import { useRouter } from "next/navigation";

import {
  getIdTokenResult,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase/client";
type AdminLoginField = "email" | "password";

export function useAdminLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: AdminLoginField, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  }, []);

  const submit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    if (!formData.email.trim() || !formData.password) {
      setNotice("Enter your email address and password to continue.");
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    try{
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password,
      );

      const tokenResult = await getIdTokenResult(userCredential.user);
      console.log(tokenResult);
      

      if (tokenResult.claims.admin !== true) {
        await signOut(auth);
        setNotice("This account does not have administrator access.");
        return;
      }
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch("/api/auth/admin-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        await signOut(auth);

        setNotice("Unable to create your admin session.");
        return;
      }
      router.replace("/admin");
    } catch {
      setNotice("We couldn’t sign you in with those details.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, router, isSubmitting]);

  return { formData, isSubmitting, notice, submit, updateField };
}
