import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminDb } from "@/lib/firebase/admin";

type RouteContext = {
  params: Promise<{
    levelId: string;
  }>;
};

export async function POST(
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

    const sectionsRef = levelRef.collection("sections");

    const existingSections = await sectionsRef.get();

    const order = existingSections.size;

    const sectionRef = sectionsRef.doc();

    await sectionRef.set({
      title,
      order,
      isOpen,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        section: {
          id: sectionRef.id,
          title,
          order,
          isOpen,
          resources: [],
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create section:", error);

    return NextResponse.json(
      { error: "Unable to create section." },
      { status: 500 },
    );
  }
}