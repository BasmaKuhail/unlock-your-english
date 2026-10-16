"use client";

import type { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { MobileAdminNavigation } from "@/components/admin/layout/mobile-admin-navigation";
import { Alert } from "@/components/admin/ui/alert";
import type { AdminAlert } from "@/lib/admin/alerts";
import type { AdminView } from "@/lib/admin/types";

type DashboardLayoutProps = {
  children: ReactNode;
  view: AdminView;
  alert?: AdminAlert | null;
};

export function DashboardLayout({ children, view, alert }: DashboardLayoutProps) {
  return (
    <div className="min-h-dvh overflow-x-clip bg-[#f7f8fc] text-ink">
      <AdminSidebar view={view} />

      <div className="lg:pl-[252px]">
        <AdminHeader view={view} />
        <main className="mx-auto max-w-[1440px] px-4 py-6 pb-28 sm:px-6 sm:py-8 sm:pb-28 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>

      <MobileAdminNavigation view={view} />

      {alert && (
        <div
          className="fixed bottom-24 left-4 right-4 z-50 mx-auto w-full max-w-md sm:left-1/2 sm:right-auto sm:-translate-x-1/2 lg:bottom-7"
        >
          <Alert title={alert.title} variant={alert.variant}>
            {alert.message}
          </Alert>
        </div>
      )}
    </div>
  );
}
