import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    levelId: string;
    sectionId: string;
  }>;
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

    const { levelId, sectionId } = await params;
    const body = await request.json().catch(() => null);
    const resourceIds: unknown = body?.resourceIds;

    if (
      !Array.isArray(resourceIds) ||
      resourceIds.length > 500 ||
      !resourceIds.every(
        (id) =>
          typeof id === "string" &&
          id.length > 0 &&
          !id.includes("/"),
      ) ||
      new Set(resourceIds).size !== resourceIds.length
    ) {
      return NextResponse.json(
        { error: "Invalid resource IDs." },
        { status: 400 },
      );
    }

    const sectionRef = adminDb
      .collection("levels")
      .doc(levelId)
      .collection("sections")
      .doc(sectionId);

    const resourcesRef = sectionRef.collection("resources");

    const result = await adminDb.runTransaction(
      async (transaction) => {
        const sectionSnapshot =
          await transaction.get(sectionRef);

        if (!sectionSnapshot.exists) {
          return "not-found";
        }

        const snapshot =
          await transaction.get(resourcesRef);

        const existingIds = new Set(
          snapshot.docs.map((doc) => doc.id),
        );

        if (
          resourceIds.length !== existingIds.size ||
          !resourceIds.every((id) => existingIds.has(id))
        ) {
          return "conflict";
        }

        resourceIds.forEach((id, index) => {
          transaction.update(resourcesRef.doc(id), {
            order: index,
            updatedAt: FieldValue.serverTimestamp(),
          });
        });

        return "success";
      },
    );

    if (result === "not-found") {
      return NextResponse.json(
        { error: "Section not found." },
        { status: 404 },
      );
    }

    if (result === "conflict") {
      return NextResponse.json(
        { error: "Resources have changed. Refresh and try again." },
        { status: 409 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder resources:", error);

    return NextResponse.json(
      { error: "Unable to reorder resources." },
      { status: 500 },
    );
  }
}