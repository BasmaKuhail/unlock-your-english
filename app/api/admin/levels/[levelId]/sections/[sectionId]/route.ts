import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminDb } from "@/lib/firebase/admin";

type RouteContext = {
  params: Promise<{
    levelId: string;
    sectionId: string;
  }>;
};

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

    const { levelId, sectionId } = await context.params;
    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const isOpen =
      typeof body.isOpen === "boolean"
        ? body.isOpen
        : false;

    if (!title) {
      return NextResponse.json(
        { error: "Section title is required." },
        { status: 400 },
      );
    }

    if (title.length > 160) {
      return NextResponse.json(
        {
          error: "Section title cannot exceed 160 characters.",
        },
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

    const sectionRef = levelRef
      .collection("sections")
      .doc(sectionId);

    const sectionSnapshot = await sectionRef.get();

    if (!sectionSnapshot.exists) {
      return NextResponse.json(
        { error: "Section not found." },
        { status: 404 },
      );
    }

    await sectionRef.update({
      title,
      isOpen,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      section: {
        id: sectionId,
        title,
        order: sectionSnapshot.get("order"),
        isOpen,
        resources: [],
      },
    });
  } catch (error) {
    console.error("Failed to update section:", error);

    return NextResponse.json(
      { error: "Unable to update section." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
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

    const { levelId, sectionId } = await context.params;

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

    const sectionRef = levelRef
      .collection("sections")
      .doc(sectionId);

    const sectionSnapshot = await sectionRef.get();

    if (!sectionSnapshot.exists) {
      return NextResponse.json(
        { error: "Section not found." },
        { status: 404 },
      );
    }

    /*
     * IMPORTANT:
     *
     * We're allowing this for now because resources are not persisted
     * as Firestore subcollections yet.
     *
     * Once resources are stored under:
     *
     * sections/{sectionId}/resources/{resourceId}
     *
     * we must NOT simply delete the section document. Firestore does
     * not automatically delete its subcollections.
     */
    await sectionRef.delete();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Failed to delete section:", error);

    return NextResponse.json(
      { error: "Unable to delete section." },
      { status: 500 },
    );
  }
}