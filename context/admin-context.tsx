"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AdminProfile = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoUrl: string | null;
  status: "active" | "frozen" | null;
};
type UpdateAdminInput = {
  displayName: string;
  email: string;
  newPassword?: string;
};

type AdminContextValue = {
  admin: AdminProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshAdmin: () => Promise<void>;
  updateAdmin: (input: UpdateAdminInput) => Promise<AdminProfile>;
};
const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAdmin = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/profile");

      if (!response.ok) {
        throw new Error("Unable to load administrator profile.");
      }

      const data: { admin: AdminProfile } = await response.json();

      setError(null);
      setAdmin(data.admin);
    } catch (error) {
      console.error("Failed to load admin profile:", error);

      setAdmin(null);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load administrator profile.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAdmin = useCallback(
  async (input: UpdateAdminInput): Promise<AdminProfile> => {
    const response = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        displayName: input.displayName,
        email: input.email,
        ...(input.newPassword
          ? { newPassword: input.newPassword }
          : {}),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ?? "Unable to update administrator profile.",
      );
    }

    setAdmin(data.admin);

    return data.admin;
  },
  [],
);
  useEffect(() => {
    queueMicrotask(() => {
      void loadAdmin();
    });
  }, [loadAdmin]);

  return (
    <AdminContext.Provider
      value={{
        admin,
        isLoading,
        error,
        refreshAdmin: loadAdmin,
        updateAdmin
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used inside an AdminProvider.");
  }

  return context;
}
