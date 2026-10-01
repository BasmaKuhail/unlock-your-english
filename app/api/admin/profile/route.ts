import { NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { UpdateRequest } from "firebase-admin/auth";

// get admin profile
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

//update admin profile
type UpdateAdminProfileBody = {
  displayName?: string;
  email?: string;
  newPassword?: string;
};

export async function PATCH(request: NextRequest) {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as UpdateAdminProfileBody;

    const profileRef = adminDb
      .collection("users")
      .doc(adminSession.uid);

    const profileSnapshot = await profileRef.get();

    if (!profileSnapshot.exists) {
      return NextResponse.json(
        { error: "Administrator profile not found." },
        { status: 404 },
      );
    }

    const existingProfile = profileSnapshot.data();

    if (existingProfile?.role !== "admin") {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 },
      );
    }

    const authUpdates: UpdateRequest = {};
    const firestoreUpdates: Record<string, unknown> = {};

    // Display name
    if (body.displayName !== undefined) {
      const displayName = body.displayName.trim();

      if (displayName.length < 2 || displayName.length > 100) {
        return NextResponse.json(
          {
            error:
              "Display name must be between 2 and 100 characters.",
          },
          { status: 400 },
        );
      }

      authUpdates.displayName = displayName;
      firestoreUpdates.displayName = displayName;
    }

    // Email
    if (body.email !== undefined) {
      const email = body.email.trim().toLowerCase();

      if (!email || !email.includes("@")) {
        return NextResponse.json(
          { error: "Enter a valid email address." },
          { status: 400 },
        );
      }

      authUpdates.email = email;
    }

    // Password
    if (body.newPassword !== undefined) {
      if (
        typeof body.newPassword !== "string" ||
        body.newPassword.length < 8
      ) {
        return NextResponse.json(
          {
            error:
              "Password must contain at least 8 characters.",
          },
          { status: 400 },
        );
      }

      authUpdates.password = body.newPassword;
    }

    if (Object.keys(authUpdates).length > 0) {
      await adminAuth.updateUser(
        adminSession.uid,
        authUpdates,
      );
    }

    if (Object.keys(firestoreUpdates).length > 0) {
      await profileRef.update({
        ...firestoreUpdates,
        updatedAt: new Date(),
      });
    }

    const [updatedAuthUser, updatedProfileSnapshot] =
      await Promise.all([
        adminAuth.getUser(adminSession.uid),
        profileRef.get(),
      ]);

    const updatedProfile = updatedProfileSnapshot.data();

    return NextResponse.json({
      admin: {
        uid: updatedAuthUser.uid,
        displayName:
          updatedProfile?.displayName ??
          updatedAuthUser.displayName ??
          null,
        email: updatedAuthUser.email ?? null,
        photoUrl: updatedAuthUser.photoURL ?? null,
        status: updatedProfile?.status ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to update admin profile:", error);

    return NextResponse.json(
      { error: "Unable to update administrator profile." },
      { status: 500 },
    );
  }
}