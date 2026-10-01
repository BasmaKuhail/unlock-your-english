import "server-only";

import { cookies } from "next/headers";

import { adminAuth } from "@/lib/firebase/admin";

export type AdminProfile = {
  name: string;
  initials: string;
  role: "Administrator";
};

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("uye_admin_session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie,
      true,
    );

    if (decodedToken.admin !== true) {
      return null;
    }

    return decodedToken;
  } catch {
    return null;
  }
}

export async function getAdminProfile(
  admin: NonNullable<Awaited<ReturnType<typeof getAdminSession>>>,
): Promise<AdminProfile> {
  try {
    const user = await adminAuth.getUser(admin.uid);
    const name =
      user.displayName?.trim() ||
      admin.name?.trim() ||
      user.email ||
      admin.email ||
      "Administrator";

    return {
      name,
      initials: getInitials(name),
      role: "Administrator",
    };
  } catch {
    const name = admin.name?.trim() || admin.email || "Administrator";

    return {
      name,
      initials: getInitials(name),
      role: "Administrator",
    };
  }
}

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "A"
  );
}
