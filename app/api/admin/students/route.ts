import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { generateStudentId } from "@/lib/students/generate-student-id";

export async function POST(request: Request) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 401 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("displayName" in body) ||
    !("password" in body) ||
    typeof body.displayName !== "string" ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json(
      { error: "Invalid student details." },
      { status: 400 },
    );
  }

  const displayName = body.displayName.trim();
  const password = body.password;

  if (displayName.length < 2 || displayName.length > 100) {
    return NextResponse.json(
      { error: "Student name must be between 2 and 100 characters." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must contain at least 8 characters." },
      { status: 400 },
    );
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
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      {
        student: {
          uid: authUser.uid,
          studentId,
          displayName,
          status: "active",
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (createdUserUid) {
      try {
        await adminAuth.deleteUser(createdUserUid);
      } catch {
        console.error(
          `Failed to clean up Auth user ${createdUserUid}.`,
        );
      }
    }

    console.error("Student creation failed:", error);

    return NextResponse.json(
      { error: "Unable to create student." },
      { status: 500 },
    );
  }
}

export async function GET() {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 401 },
    );
  }

  try {
    const snapshot = await adminDb
      .collection("users")
      .where("role", "==", "student")
      .get();

    const students = snapshot.docs.map((document) => {
      const data = document.data();

      return {
        uid: document.id,
        studentId: data.studentId,
        name: data.displayName,
        level: data.currentLevel ?? null,
        levelOpen: data.levelOpen ?? false,
        progress: 0,
        status: data.status === "frozen" ? "Frozen" : "Active",
      };
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Failed to load students:", error);

    return NextResponse.json(
      { error: "Unable to load students." },
      { status: 500 },
    );
  }
}