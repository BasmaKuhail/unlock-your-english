import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ levelId: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const adminSession = await getAdminSession();

    if (!adminSession) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 401 },
      );
    }

    const { levelId } = await params;
    const body = await request.json().catch(() => null);
    const sectionIds: unknown = body?.sectionIds;

    if (
      !Array.isArray(sectionIds) ||
      sectionIds.length > 500 ||
      !sectionIds.every(
        (id) =>
          typeof id === "string" &&
          id.length > 0 &&
          !id.includes("/"),
      ) ||
      new Set(sectionIds).size !== sectionIds.length
    ) {
      return NextResponse.json(
        { error: "Invalid section IDs." },
        { status: 400 },
      );
    }

    const levelRef = adminDb.collection("levels").doc(levelId);
    const sectionsRef = levelRef.collection("sections");

    const result = await adminDb.runTransaction(
      async (transaction) => {
        const levelSnapshot = await transaction.get(levelRef);

        if (!levelSnapshot.exists) {
          return "not-found";
        }

        const snapshot = await transaction.get(sectionsRef);

        const existingIds = new Set(
          snapshot.docs.map((doc) => doc.id),
        );

        if (
          sectionIds.length !== existingIds.size ||
          !sectionIds.every((id) => existingIds.has(id))
        ) {
          return "conflict";
        }

        sectionIds.forEach((id, index) => {
          transaction.update(sectionsRef.doc(id), {
            order: index,
            updatedAt: FieldValue.serverTimestamp(),
          });
        });

        return "success";
      },
    );

    if (result === "not-found") {
      return NextResponse.json(
        { error: "Level not found." },
        { status: 404 },
      );
    }

    if (result === "conflict") {
      return NextResponse.json(
        { error: "Sections have changed. Refresh and try again." },
        { status: 409 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder sections:", error);

    return NextResponse.json(
      { error: "Unable to reorder sections." },
      { status: 500 },
    );
  }
}