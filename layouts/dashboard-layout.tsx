"use client";

import type { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { MobileAdminNavigation } from "@/components/admin/layout/mobile-admin-navigation";
import type { AdminProfile, AdminView } from "@/lib/admin/types";

type DashboardLayoutProps = {
  children: ReactNode;
  view: AdminView;
  toast?: string | null;
  adminProfile: AdminProfile;
};

export function DashboardLayout({ children, view, toast, adminProfile }: DashboardLayoutProps) {
  return (
    <div className="min-h-dvh overflow-x-clip bg-[#f7f8fc] text-ink">
      <AdminSidebar adminProfile={adminProfile} view={view} />

      <div className="lg:pl-[252px]">
        <AdminHeader adminProfile={adminProfile} view={view} />
        <main className="mx-auto max-w-[1440px] px-4 py-6 pb-28 sm:px-6 sm:py-8 sm:pb-28 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>

      <MobileAdminNavigation view={view} />

      {toast && (
        <div
          aria-live="polite"
          className="fixed bottom-24 left-4 right-4 z-50 mx-auto w-fit max-w-[calc(100%-2rem)] -translate-x-0 rounded-full bg-ink px-5 py-3 text-center text-sm font-semibold text-white shadow-xl sm:left-1/2 sm:right-auto sm:-translate-x-1/2 lg:bottom-7"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
