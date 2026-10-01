import { PageHeading } from "@/components/admin/ui/page-heading";
import { AdminAvatar } from "@/components/admin/ui/admin-avatar";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import type { AdminProfile } from "@/lib/admin/types";

export function AdminProfilePage({
  adminProfile,
}: {
  adminProfile: AdminProfile;
}) {
  return (
    <DashboardLayout adminProfile={adminProfile} view="profile">
      <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
        <PageHeading eyebrow="Account" title="Admin profile">
          <p className="max-w-xl pb-1 text-sm text-ink/50">
            Your authenticated Uye administrator account details.
          </p>
        </PageHeading>

        <section className="overflow-hidden rounded-2xl border border-[#e7e9f0] bg-white">
          <div className="flex flex-col gap-4 bg-[#f6f8fc] px-5 py-6 sm:flex-row sm:items-center sm:px-7">
            <AdminAvatar className="h-16 w-16 shrink-0 rounded-2xl" />
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold tracking-[-0.04em]">
                {adminProfile.name}
              </h2>
              <p className="mt-1 truncate text-sm text-ink/50">
                {adminProfile.email}
              </p>
            </div>
            <span className="w-fit rounded-full bg-[#eaf0ff] px-3 py-1.5 text-xs font-bold text-brand sm:ml-auto">
              {adminProfile.role}
            </span>
          </div>

          <dl className="grid divide-y divide-[#edf0f5] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <ProfileDetail label="Full name" value={adminProfile.name} />
            <ProfileDetail label="Email address" value={adminProfile.email} />
          </dl>
        </section>

        <section className="rounded-2xl border border-[#e7e9f0] bg-white p-5 sm:p-6">
          <h2 className="text-base font-bold">Account security</h2>
          <p className="mt-2 text-sm leading-6 text-ink/55">
            This profile is loaded from the authenticated Firebase admin account.
            Contact a system administrator to change account credentials or access.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}

function ProfileDetail({ label, value }: { label: string; value: string }) {
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
