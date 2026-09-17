import { useCallback, useState, type FormEvent } from "react";

import { signInWithLearnerId } from "@/lib/auth/learner-auth";

import { useRouter } from "next/navigation";


type LoginField = "id" | "password";

export function useLoginForm() {
  const [formData, setFormData] = useState({ id: "", password: "" });
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const updateField = useCallback((field: LoginField, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  }, []);

  const submit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.id.trim() || !formData.password) {
      setNotice("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    try {
      await signInWithLearnerId({ learnerId: formData.id, password: formData.password });
      setNotice("Correct!");
      router.replace("/")
    } catch (error) {
      console.error(error);
      setNotice("Invalid learner ID or password.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return { formData, isSubmitting, notice, submit, updateField };
}
