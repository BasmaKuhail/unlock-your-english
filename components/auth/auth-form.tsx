import { FormEvent, useState } from "react";

import { loginContent } from "@/content/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase/client";

type FieldProps = {
  id: string;
  label: string;
  type?: "password" | "text";
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
};

function studentIdToEmail(studentId: string) {
  return `${studentId.trim().toLowerCase()}@students.uye.local`;
}
function Field({ id, label, type = "text", autoComplete, value, onChange }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink" htmlFor={id}>
        {label}
      </label>
      <input
        autoComplete={autoComplete}
        className="mt-1.5 block w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-4 focus:ring-brand/10"
        id={id}
        name={id}
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function AuthForm() {
  const [notice, setNotice] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    password: "",
  })
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.id.trim() || !formData.password) {
      setNotice("Please fill in all fields.");
      return;
    }
    setNotice(null);

    try {
      const email = studentIdToEmail(formData.id);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        formData.password,
      );

      console.log("Logged in:", userCredential.user.uid);
    } catch (error) {
      console.error(error);
      setNotice("Invalid learner ID or password.");
    }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.055em] text-ink">
          {loginContent.title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-ink/60">{loginContent.description}</p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <Field 
          autoComplete="username" 
          id="learner-id" 
          label="Learner ID" 
          value={formData.id} 
          onChange={
            (id) =>
            setFormData((current) => ({
              ...current,
              id,
            }))
          }/>
        <div>
          <div className="flex items-center justify-between gap-4">
            <label className="block text-sm font-semibold text-ink" htmlFor="password">
              Password
            </label>
          </div>
          <input
            autoComplete="current-password"
            className="mt-1.5 block w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-4 focus:ring-brand/10"
            id="password"
            minLength={8}
            name="password"
            required
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((current) => ({
                ...current,
                password: e.target.value,
              }))
            }
          />
        </div>

        <button
          className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(61,114,251,0.25)] transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_14px_28px_rgba(61,114,251,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          type="submit"
        >
          {loginContent.submitLabel}
        </button>
      </form>

      <p aria-live="polite" className="mt-3 min-h-5 text-center text-sm text-ink/60">
        {notice}
      </p>
    </>
  );
}
