import { NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

type UpdateStudentBody = {
  displayName?: string;
  currentLevelId?: string | null;
  levelOpen?: boolean;
  status?: "active" | "frozen";
  newPassword?: string;
};

type RouteContext = {
  params: Promise<{ uid: string }>;
};

async function getLevelAssignment(levelId: string | null) {
  if (levelId === null) return { id: null, title: null };

  const levelSnapshot = await adminDb.collection("levels").doc(levelId).get();
  const title = levelSnapshot.get("title");

  if (!levelSnapshot.exists || typeof title !== "string" || !title.trim()) {
    return null;
  }

  return { id: levelSnapshot.id, title: title.trim() };
}

async function serializeStudent(uid: string) {
  const snapshot = await adminDb.collection("users").doc(uid).get();
  const data = snapshot.data();
  const levelId = typeof data?.currentLevelId === "string" ? data.currentLevelId : null;
  const level = typeof data?.currentLevel === "string" ? data.currentLevel : null;

  return {
    uid,
    studentId: data?.studentId,
    name: data?.displayName,
    levelId,
    level,
    levelOpen: data?.levelOpen ?? false,
    progress: 0,
    status: data?.status === "frozen" ? "Frozen" : "Active",
  };
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
  }

  const { uid } = await context.params;

  try {
    const body = (await request.json()) as UpdateStudentBody;
    const studentRef = adminDb.collection("users").doc(uid);
    const studentSnapshot = await studentRef.get();

    if (!studentSnapshot.exists || studentSnapshot.data()?.role !== "student") {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const firestoreUpdates: Record<string, unknown> = { updatedAt: new Date() };
    const authUpdates: { displayName?: string; password?: string; disabled?: boolean } = {};

    if (body.displayName !== undefined) {
      if (typeof body.displayName !== "string") {
        return NextResponse.json({ error: "Invalid student name." }, { status: 400 });
      }

      const displayName = body.displayName.trim();
      if (displayName.length < 2 || displayName.length > 100) {
        return NextResponse.json({ error: "Student name must be between 2 and 100 characters." }, { status: 400 });
      }

      firestoreUpdates.displayName = displayName;
      authUpdates.displayName = displayName;
    }

    if (body.currentLevelId !== undefined) {
      if (body.currentLevelId !== null && typeof body.currentLevelId !== "string") {
        return NextResponse.json({ error: "Invalid current level." }, { status: 400 });
      }

      const levelAssignment = await getLevelAssignment(body.currentLevelId);
      if (!levelAssignment) {
        return NextResponse.json({ error: "Level not found." }, { status: 404 });
      }

      firestoreUpdates.currentLevelId = levelAssignment.id;
      firestoreUpdates.currentLevel = levelAssignment.title;
    }

    if (body.levelOpen !== undefined) {
      if (typeof body.levelOpen !== "boolean") {
        return NextResponse.json({ error: "Invalid level access value." }, { status: 400 });
      }
      firestoreUpdates.levelOpen = body.levelOpen;
    }

    if (body.status !== undefined) {
      if (body.status !== "active" && body.status !== "frozen") {
        return NextResponse.json({ error: "Invalid account status." }, { status: 400 });
      }
      firestoreUpdates.status = body.status;
      authUpdates.disabled = body.status === "frozen";
    }

    if (body.newPassword !== undefined) {
      if (typeof body.newPassword !== "string" || body.newPassword.length < 8) {
        return NextResponse.json({ error: "Password must contain at least 8 characters." }, { status: 400 });
      }
      authUpdates.password = body.newPassword;
    }

    if (Object.keys(authUpdates).length > 0) await adminAuth.updateUser(uid, authUpdates);
    await studentRef.update(firestoreUpdates);

    return NextResponse.json({ student: await serializeStudent(uid) });
  } catch (error) {
    console.error("Failed to update student:", error);
    return NextResponse.json({ error: "Unable to update student." }, { status: 500 });
  }
}
