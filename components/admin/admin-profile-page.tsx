"use client";

import { useState } from "react";

import { AdminLogoutButton } from "@/components/admin/layout/admin-logout-btn";
import { AdminAvatar } from "@/components/admin/ui/admin-avatar";
import { PageHeading } from "@/components/admin/ui/page-heading";
import { useAdmin } from "@/context/admin-context";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { AdminProfileEditor } from "./admin-profile-editor";

export function AdminProfilePage() {
  const { admin, error, isLoading } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);

  const displayName = admin?.displayName?.trim() || "Administrator";
  const email = admin?.email || "Not available";

  const status = isLoading
    ? "Loading..."
    : admin?.status === "frozen"
      ? "Frozen"
      : admin
        ? "Active"
        : "Unavailable";

  return (
    <DashboardLayout view="profile">
      <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
        <PageHeading eyebrow="Account" title="Admin profile">
          <button
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!admin || isLoading}
            onClick={() => setIsEditing(true)}
            type="button"
          >
            Edit profile
          </button>
        </PageHeading>

        <section className="overflow-hidden rounded-2xl border border-[#e7e9f0] bg-white">
          <div className="flex flex-col gap-4 bg-[#f6f8fc] px-5 py-6 sm:flex-row sm:items-center sm:px-7">
            <AdminAvatar className="h-16 w-16 shrink-0 rounded-2xl" />

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold tracking-[-0.04em]">
                {displayName}
              </h2>

              <p className="mt-1 truncate text-sm text-ink/50">
                {isLoading ? "Loading profile..." : email}
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#eaf0ff] px-3 py-1.5 text-xs font-bold text-brand sm:ml-auto">
              {status}
            </span>
          </div>

          <dl className="grid divide-y divide-[#edf0f5] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <ProfileDetail label="Display name" value={displayName} />
            <ProfileDetail label="Email address" value={email} />
          </dl>
        </section>

        <section className="rounded-2xl border border-[#e7e9f0] bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold">Account security</h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-ink/55">
                You can update your account details and password from this
                profile. Changing your password will require you to sign in
                again.
              </p>
            </div>

            <AdminLogoutButton />
          </div>

          {error && (
            <p
              className="mt-4 text-sm font-medium text-[#bd3c34]"
              role="alert"
            >
              {error}
            </p>
          )}
        </section>
      </div>

      {isEditing && admin && (
        <AdminProfileEditor
          admin={admin}
          onClose={() => setIsEditing(false)}
        />
      )}
    </DashboardLayout>
  );
}

function ProfileDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 px-5 py-5 sm:px-6">
      <dt className="text-xs font-bold uppercase tracking-[0.1em] text-ink/42">
        {label}
      </dt>

      <dd className="mt-2 break-words text-sm font-semibold text-ink/75">
        {value}
      </dd>
    </div>
  );
}