import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { generateStudentId } from "@/lib/students/generate-student-id";

type LevelAssignment = {
  id: string | null;
  title: string | null;
};

async function getLevelAssignment(levelId: unknown): Promise<LevelAssignment | null> {
  if (levelId === undefined || levelId === null || levelId === "") {
    return { id: null, title: null };
  }

  if (typeof levelId !== "string") return null;

  const levelSnapshot = await adminDb.collection("levels").doc(levelId).get();
  if (!levelSnapshot.exists) return null;

  const title = levelSnapshot.get("title");
  if (typeof title !== "string" || !title.trim()) return null;

  return { id: levelSnapshot.id, title: title.trim() };
}

export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    const value: unknown = await request.json();
    if (typeof value !== "object" || value === null) throw new Error();
    body = value as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.displayName !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Invalid student details." }, { status: 400 });
  }

  const displayName = body.displayName.trim();
  const password = body.password;
  const levelAssignment = await getLevelAssignment(body.currentLevelId);

  if (displayName.length < 2 || displayName.length > 100) {
    return NextResponse.json({ error: "Student name must be between 2 and 100 characters." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must contain at least 8 characters." }, { status: 400 });
  }
  if (!levelAssignment) {
    return NextResponse.json({ error: "Choose a valid level." }, { status: 400 });
  }
  if (body.levelOpen !== undefined && typeof body.levelOpen !== "boolean") {
    return NextResponse.json({ error: "Invalid level access value." }, { status: 400 });
  }

  const studentId = await generateStudentId();
  const authEmail = `${studentId.toLowerCase()}@students.uye.local`;
  let createdUserUid: string | null = null;

  try {
    const authUser = await adminAuth.createUser({
      email: authEmail,
      password,
      displayName,
      disabled: false,
    });
    createdUserUid = authUser.uid;

    const now = new Date();
    await adminDb.collection("users").doc(authUser.uid).set({
      studentId,
      displayName,
      role: "student",
      status: "active",
      currentLevelId: levelAssignment.id,
      currentLevel: levelAssignment.title,
      levelOpen: body.levelOpen === true,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      student: {
        uid: authUser.uid,
        studentId,
        name: displayName,
        levelId: levelAssignment.id,
        level: levelAssignment.title,
        levelOpen: body.levelOpen === true,
        progress: 0,
        status: "Active",
      },
    }, { status: 201 });
  } catch (error) {
    if (createdUserUid) {
      try {
        await adminAuth.deleteUser(createdUserUid);
      } catch {
        console.error(`Failed to clean up Auth user ${createdUserUid}.`);
      }
    }

    console.error("Student creation failed:", error);
    return NextResponse.json({ error: "Unable to create student." }, { status: 500 });
  }
}

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
  }

  try {
    const [studentSnapshot, levelSnapshot] = await Promise.all([
      adminDb.collection("users").where("role", "==", "student").get(),
      adminDb.collection("levels").get(),
    ]);
    const levelById = new Map(
      levelSnapshot.docs.map((level) => [level.id, level.get("title") as string]),
    );
    const levelIdByTitle = new Map(
      levelSnapshot.docs
        .filter((level) => typeof level.get("title") === "string")
        .map((level) => [level.get("title") as string, level.id]),
    );

    const students = studentSnapshot.docs.map((document) => {
      const data = document.data();
      const storedLevelId = typeof data.currentLevelId === "string" ? data.currentLevelId : null;
      const legacyLevel = typeof data.currentLevel === "string" ? data.currentLevel : null;
      const levelId = storedLevelId ?? (legacyLevel ? levelIdByTitle.get(legacyLevel) ?? null : null);
      const level = levelId ? levelById.get(levelId) ?? legacyLevel : legacyLevel;

      return {
        uid: document.id,
        studentId: data.studentId,
        name: data.displayName,
        levelId,
        level: level ?? null,
        levelOpen: data.levelOpen ?? false,
        progress: 0,
        status: data.status === "frozen" ? "Frozen" : "Active",
      };
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Failed to load students:", error);
    return NextResponse.json({ error: "Unable to load students." }, { status: 500 });
  }
}
