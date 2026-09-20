import "server-only";

import { cookies } from "next/headers";

import { adminAuth } from "@/lib/firebase/admin";

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