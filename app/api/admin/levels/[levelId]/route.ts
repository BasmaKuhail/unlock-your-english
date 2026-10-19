import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminDb } from "@/lib/firebase/admin";

type RouteContext = {
  params: Promise<{
    levelId: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
    }

    const { levelId } = await context.params;
    const levelRef = adminDb.collection("levels").doc(levelId);
    const levelSnapshot = await levelRef.get();
    if (!levelSnapshot.exists) {
      return NextResponse.json({ error: "Level not found." }, { status: 404 });
    }

    const students = await adminDb.collection("users").where("role", "==", "student").get();
    const hasStudents = students.docs.some((student) =>
      student.get("currentLevelId") === levelId ||
      (!student.get("currentLevelId") && student.get("currentLevel") === levelSnapshot.get("title")),
    );
    if (hasStudents) {
      return NextResponse.json(
        { error: "Reassign or remove all students from this level before deleting it." },
        { status: 409 },
      );
    }

    // Firestore does not automatically remove sections or their resources.
    // Uploaded files follow the existing separate B2 cleanup process.
    await adminDb.recursiveDelete(levelRef);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete level:", error);
    return NextResponse.json({ error: "Unable to delete level." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const adminSession = await getAdminSession();

    if (!adminSession) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 401 },
      );
    }

    const { levelId } = await context.params;
    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const isOpen =
      typeof body.isOpen === "boolean"
        ? body.isOpen
        : false;

    if (!title) {
      return NextResponse.json(
        { error: "Level title is required." },
        { status: 400 },
      );
    }

    if (title.length > 120) {
      return NextResponse.json(
        { error: "Level title cannot exceed 120 characters." },
        { status: 400 },
      );
    }

    if (description.length > 600) {
      return NextResponse.json(
        { error: "Level description cannot exceed 600 characters." },
        { status: 400 },
      );
    }

    const levelRef = adminDb
      .collection("levels")
      .doc(levelId);

    const levelSnapshot = await levelRef.get();

    if (!levelSnapshot.exists) {
      return NextResponse.json(
        { error: "Level not found." },
        { status: 404 },
      );
    }

    await levelRef.update({
      title,
      description: description || null,
      isOpen,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      level: {
        id: levelId,
        title,
        description: description || null,
        order: levelSnapshot.get("order"),
        isOpen,
      },
    });
  } catch (error) {
    console.error("Failed to update level:", error);

    return NextResponse.json(
      { error: "Unable to update level." },
      { status: 500 },
    );
  }
}
