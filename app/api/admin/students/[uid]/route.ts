import { NextRequest, NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/auth/admin-session";

type UpdateStudentBody = {
  displayName?: string;
  currentLevel?: string | null;
  levelOpen?: boolean;
  status?: "active" | "frozen";
  newPassword?: string;
};

type RouteContext = {
  params: Promise<{
    uid: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 401 },
    );
  }

  const { uid } = await context.params;

  try {
    const body = (await request.json()) as UpdateStudentBody;

    const studentRef = adminDb.collection("users").doc(uid);
    const studentSnapshot = await studentRef.get();

    if (!studentSnapshot.exists) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 },
      );
    }

    const existingStudent = studentSnapshot.data();

    if (existingStudent?.role !== "student") {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 },
      );
    }

    const firestoreUpdates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    const authUpdates: {
      displayName?: string;
      password?: string;
      disabled?: boolean;
    } = {};

    // Full name
    if (body.displayName !== undefined) {
      const displayName = body.displayName.trim();

      if (displayName.length < 2 || displayName.length > 100) {
        return NextResponse.json(
          { error: "Student name must be between 2 and 100 characters." },
          { status: 400 },
        );
      }

      firestoreUpdates.displayName = displayName;
      authUpdates.displayName = displayName;
    }

    // Current level
    if (body.currentLevel !== undefined) {
      if (
        body.currentLevel !== null &&
        typeof body.currentLevel !== "string"
      ) {
        return NextResponse.json(
          { error: "Invalid current level." },
          { status: 400 },
        );
      }

      firestoreUpdates.currentLevel = body.currentLevel;
    }

    // Level access
    if (body.levelOpen !== undefined) {
      if (typeof body.levelOpen !== "boolean") {
        return NextResponse.json(
          { error: "Invalid level access value." },
          { status: 400 },
        );
      }

      firestoreUpdates.levelOpen = body.levelOpen;
    }

    // Account status
    if (body.status !== undefined) {
      if (body.status !== "active" && body.status !== "frozen") {
        return NextResponse.json(
          { error: "Invalid account status." },
          { status: 400 },
        );
      }

      firestoreUpdates.status = body.status;
      authUpdates.disabled = body.status === "frozen";
    }

    // Password
    if (body.newPassword !== undefined) {
      if (
        typeof body.newPassword !== "string" ||
        body.newPassword.length < 8
      ) {
        return NextResponse.json(
          { error: "Password must contain at least 8 characters." },
          { status: 400 },
        );
      }

      authUpdates.password = body.newPassword;
    }

    if (Object.keys(authUpdates).length > 0) {
      await adminAuth.updateUser(uid, authUpdates);
    }

    await studentRef.update(firestoreUpdates);

    const updatedSnapshot = await studentRef.get();
    const updated = updatedSnapshot.data();

    return NextResponse.json({
      student: {
        uid,
        studentId: updated?.studentId,
        name: updated?.displayName,
        level: updated?.currentLevel ?? null,
        levelOpen: updated?.levelOpen ?? false,
        status: updated?.status === "frozen" ? "Frozen" : "Active",
      },
    });
  } catch (error) {
    console.error("Failed to update student:", error);

    return NextResponse.json(
      { error: "Unable to update student." },
      { status: 500 },
    );
  }
}