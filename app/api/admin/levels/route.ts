import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminDb } from "@/lib/firebase/admin";
import type { Level } from "@/lib/admin/types";

export async function GET() {
  try {
    const adminSession = await getAdminSession();

    if (!adminSession) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 401 },
      );
    }

    const levelsSnapshot = await adminDb
      .collection("levels")
      .orderBy("order", "asc")
      .get();

    const levels: Level[] = await Promise.all(
      levelsSnapshot.docs.map(async (levelDocument) => {
        const sectionsSnapshot = await levelDocument.ref
          .collection("sections")
          .orderBy("order", "asc")
          .get();

        const sections = sectionsSnapshot.docs.map((sectionDocument) => ({
          id: sectionDocument.id,
          title: sectionDocument.get("title"),
          order: sectionDocument.get("order"),
          isOpen: sectionDocument.get("isOpen") ?? false,
          resources: [],
        }));

        return {
          id: levelDocument.id,
          title: levelDocument.get("title"),
          description:
            levelDocument.get("description") ?? null,
          order: levelDocument.get("order"),
          isOpen:
            levelDocument.get("isOpen") ?? false,
          sections,
        };
      }),
    );

    return NextResponse.json({ levels });
  } catch (error) {
    console.error("Failed to load levels:", error);

    return NextResponse.json(
      { error: "Unable to load levels." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Verify the admin session.
    const adminSession = await getAdminSession();

    if (!adminSession) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 401 },
      );
    }

    // 2. Parse the incoming request.
    const body = await request.json();

    // 3. Validate and normalise fields.
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

    // 4. Determine the new level's position.
    //
    // This is intentionally simple for now because UYE has a small
    // number of admins creating levels infrequently.
    const existingLevels = await adminDb
      .collection("levels")
      .get();

    const order = existingLevels.size;

    // 5. Ask Firestore to generate the permanent level ID.
    const levelRef = adminDb
      .collection("levels")
      .doc();

    // 6. Persist the level.
    await levelRef.set({
      title,
      description: description || null,
      order,
      isOpen,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 7. Build the version that the frontend needs.
    //
    // We don't need to read the document back because we already know
    // all of the frontend-facing values that were written.
    const level: Level = {
      id: levelRef.id,
      title,
      description: description || null,
      order,
      isOpen,
      sections: [],
    };

    // 8. Return the newly-created level.
    return NextResponse.json(
      { level },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create level:", error);

    return NextResponse.json(
      { error: "Unable to create level." },
      { status: 500 },
    );
  }
}



