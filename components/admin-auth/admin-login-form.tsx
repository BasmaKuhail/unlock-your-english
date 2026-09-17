"use client";

import Link from "next/link";



import { useAdminLoginForm } from "@/hooks/use-admin-login-form";

export function AdminLoginForm() {
  const { formData, isSubmitting, notice, submit, updateField } = useAdminLoginForm();

  
  return (
    <>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Uye administration</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.055em] text-ink">Admin sign in</h1>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          Use your staff account to manage learners and course content.
        </p>
      </div>

      <form className="mt-7 space-y-4" onSubmit={submit}>
        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="admin-email">Email address</label>
          <input
            autoComplete="email"
            className="mt-1.5 block w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-4 focus:ring-brand/10"
            id="admin-email"
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="name@uye.com"
            required
            type="email"
            value={formData.email}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="admin-password">Password</label>
          <input
            autoComplete="current-password"
            className="mt-1.5 block w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink/35 focus:border-brand focus:ring-4 focus:ring-brand/10"
            id="admin-password"
            minLength={8}
            name="password"
            onChange={(event) => updateField("password", event.target.value)}
            required
            type="password"
            value={formData.password}
          />
        </div>

        <button
          className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(61,114,251,0.25)] transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_14px_28px_rgba(61,114,251,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Signing in…" : "Access dashboard"}
        </button>
      </form>

      <p aria-live="polite" className="mt-3 min-h-5 text-center text-sm text-ink/60 text-red-400">
        {notice}
      </p>
      <p className="mt-4 text-center text-sm text-ink/55">
        Looking for learner sign in? <Link className="font-semibold text-brand hover:text-brand-dark" href="/login">Go to learner login</Link>
      </p>
    </>
  );
}
