
import { NextResponse } from "next/server";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminDb } from "@/lib/firebase/admin";
import { b2, B2_BUCKET_NAME } from "@/lib/storage/b2";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    levelId: string;
    sectionId: string;
    resourceId: string;
  }>;
};

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getString(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

async function getResourceRefs(context: RouteContext) {
  const { levelId, sectionId, resourceId } =
    await context.params;

  const levelRef = adminDb.collection("levels").doc(levelId);
  const sectionRef = levelRef.collection("sections").doc(sectionId);
  const resourceRef = sectionRef
    .collection("resources")
    .doc(resourceId);

  const [levelSnap, sectionSnap, resourceSnap] =
    await Promise.all([
      levelRef.get(),
      sectionRef.get(),
      resourceRef.get(),
    ]);

  if (
    !levelSnap.exists ||
    !sectionSnap.exists ||
    !resourceSnap.exists
  ) {
    return null;
  }

  return { resourceRef, resourceSnap };
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 401 },
      );
    }

    const refs = await getResourceRefs(context);

    if (!refs) {
      return NextResponse.json(
        { error: "Resource not found." },
        { status: 404 },
      );
    }

    const body: unknown = await request.json();

    if (!isRecord(body)) {
      return NextResponse.json(
        { error: "Invalid resource details." },
        { status: 400 },
      );
    }

    const title = getString(body.title, 160);
    const type = body.type;

    if (!title) {
      return NextResponse.json(
        { error: "Resource title is required." },
        { status: 400 },
      );
    }

    let resourceData: Record<string, unknown>;

    if (type === "text") {
      resourceData = {
        title,
        type: "text",
        content: getString(body.content, 50_000),
      };
    } else if (type === "link") {
      const url = getString(body.url, 2048);

      let parsedUrl: URL;

      try {
        parsedUrl = new URL(url);
      } catch {
        return NextResponse.json(
          { error: "Enter a valid URL." },
          { status: 400 },
        );
      }

      if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
      ) {
        return NextResponse.json(
          { error: "Only HTTP and HTTPS links are supported." },
          { status: 400 },
        );
      }

      resourceData = {
        title,
        type: "link",
        url,
      };
    } else if (type === "file" || type === "voice") {
      const fileName = getString(body.fileName, 255);
      const storagePath = getString(body.storagePath, 500);

      if (
        !fileName ||
        !storagePath.startsWith(`level-resources/${type}/`)
      ) {
        return NextResponse.json(
          { error: "Invalid uploaded file reference." },
          { status: 400 },
        );
      }

      const previous = refs.resourceSnap.data();

      // An existing reference may be retained.
      // New file references must belong to this admin.
      const isSameObject =
        previous?.storagePath === storagePath &&
        previous?.type === type;

      let object;

      try {
        object = await b2.send(
          new HeadObjectCommand({
            Bucket: B2_BUCKET_NAME,
            Key: storagePath,
          }),
        );
      } catch {
        return NextResponse.json(
          { error: "Uploaded file was not found." },
          { status: 400 },
        );
      }

      if (
        !isSameObject &&
        object.Metadata?.uploadedby !== admin.uid
      ) {
        return NextResponse.json(
          { error: "Uploaded file is not authorised." },
          { status: 403 },
        );
      }

      resourceData = {
        title,
        type,
        fileName,
        storagePath,
        mimeType:
          object.ContentType || "application/octet-stream",
        size: object.ContentLength ?? 0,
      };
    } else {
      return NextResponse.json(
        { error: "Unsupported resource type." },
        { status: 400 },
      );
    }

    // Firestore merge retains order and createdAt.
    await refs.resourceRef.set({
        ...resourceData,
        order: refs.resourceSnap.get("order") ?? 0,
        createdAt: refs.resourceSnap.get("createdAt") ?? new Date(),
        updatedAt: new Date(),
    });

    return NextResponse.json({
      resource: {
        id: refs.resourceRef.id,
        ...refs.resourceSnap.data(),
        ...resourceData,
      },
    });
  } catch (error) {
    console.error("Failed to update resource:", error);

    return NextResponse.json(
      { error: "Unable to update resource." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 401 },
      );
    }

    const refs = await getResourceRefs(context);

    if (!refs) {
      return NextResponse.json(
        { error: "Resource not found." },
        { status: 404 },
      );
    }

    // Delete Firestore metadata only.
    // B2 cleanup will be managed separately.
    await refs.resourceRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete resource:", error);

    return NextResponse.json(
      { error: "Unable to delete resource." },
      { status: 500 },
    );
  }
}
