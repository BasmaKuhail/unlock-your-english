
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    const adminSession = await getAdminSession();

    if (!adminSession) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => null);
    const levelIds: unknown = body?.levelIds;

    if (
      !Array.isArray(levelIds) ||
      levelIds.length === 0 ||
      !levelIds.every(
        (id) =>
          typeof id === "string" &&
          id.length > 0 &&
          !id.includes("/"),
      )
    ) {
      return NextResponse.json(
        { error: "Invalid level IDs." },
        { status: 400 },
      );
    }

    const uniqueIds = new Set<string>(levelIds);

    if (uniqueIds.size !== levelIds.length) {
      return NextResponse.json(
        { error: "Duplicate level IDs are not allowed." },
        { status: 400 },
      );
    }

    const levelsRef = adminDb.collection("levels");
    const snapshot = await levelsRef.get();

    const existingIds = new Set(
      snapshot.docs.map((doc) => doc.id),
    );

    if (
      levelIds.length !== existingIds.size ||
      !levelIds.every((id) => existingIds.has(id))
    ) {
      return NextResponse.json(
        {
          error:
            "The levels list has changed. Refresh and try again.",
        },
        { status: 409 },
      );
    }

    const batch = adminDb.batch();

    levelIds.forEach((id, index) => {
      batch.update(levelsRef.doc(id), {
        order: index,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder levels:", error);

    return NextResponse.json(
      { error: "Unable to reorder levels." },
      { status: 500 },
    );
  }
}
