import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const adminSession = await getAdminSession();

    if (!adminSession) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 401 },
      );
    }

    const [authUser, profileSnapshot] = await Promise.all([
      adminAuth.getUser(adminSession.uid),
      adminDb.collection("users").doc(adminSession.uid).get(),
    ]);

    if (!profileSnapshot.exists) {
      return NextResponse.json(
        { error: "Administrator profile not found." },
        { status: 404 },
      );
    }

    const profile = profileSnapshot.data();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 },
      );
    }

    return NextResponse.json({
      admin: {
        uid: authUser.uid,
        displayName: profile.displayName ?? authUser.displayName ?? null,
        email: authUser.email ?? null,
        photoUrl: authUser.photoURL ?? null,
        status: profile.status ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to load admin profile:", error);

    return NextResponse.json(
      { error: "Unable to load admin profile." },
      { status: 500 },
    );
  }
}