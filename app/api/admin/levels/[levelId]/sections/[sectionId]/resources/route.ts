
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
  }>;
};

type ResourceInput = Record<string, unknown>;

function isRecord(value: unknown): value is ResourceInput {
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

export async function POST(
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

    const { levelId, sectionId } = await context.params;

    const levelRef = adminDb.collection("levels").doc(levelId);
    const sectionRef = levelRef.collection("sections").doc(sectionId);

    const [levelSnap, sectionSnap] = await Promise.all([
      levelRef.get(),
      sectionRef.get(),
    ]);

    if (!levelSnap.exists || !sectionSnap.exists) {
      return NextResponse.json(
        { error: "Level or section not found." },
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

    const resourcesRef = sectionRef.collection("resources");

    const existing = await resourcesRef.get();
    const order = existing.size;

    let resourceData: Record<string, unknown>;

    if (type === "text") {
      const content = getString(body.content, 50_000);

      resourceData = {
        title,
        type: "text",
        content,
        order,
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
        order,
      };
    } else if (type === "file" || type === "voice") {
      const storagePath = getString(body.storagePath, 500);
      const fileName = getString(body.fileName, 255);

      if (
        !storagePath.startsWith(`level-resources/${type}/`) ||
        !fileName
      ) {
        return NextResponse.json(
          { error: "Invalid uploaded file reference." },
          { status: 400 },
        );
      }

      // Verify that the referenced object exists in B2.
      // This does not establish ownership by itself.
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

      if (object.Metadata?.uploadedby !== admin.uid) {
        return NextResponse.json(
          { error: "Uploaded file is not authorised for this administrator." },
          { status: 403 },
        );
      }

      const mimeType =
        object.ContentType || "application/octet-stream";

      resourceData = {
        title,
        type,
        fileName,
        storagePath,
        mimeType,
        size: object.ContentLength ?? 0,
        order,
      };
    } else {
      return NextResponse.json(
        { error: "Unsupported resource type." },
        { status: 400 },
      );
    }

    const resourceRef = resourcesRef.doc();

    await resourceRef.set({
      ...resourceData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        resource: {
          id: resourceRef.id,
          ...resourceData,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create resource:", error);

    return NextResponse.json(
      { error: "Unable to create resource." },
      { status: 500 },
    );
  }
}


//GET 
export async function GET(
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

    const { levelId, sectionId } = await context.params;

    const levelRef = adminDb.collection("levels").doc(levelId);
    const sectionRef = levelRef.collection("sections").doc(sectionId);

    const [levelSnap, sectionSnap] = await Promise.all([
      levelRef.get(),
      sectionRef.get(),
    ]);

    if (!levelSnap.exists || !sectionSnap.exists) {
      return NextResponse.json(
        { error: "Level or section not found." },
        { status: 404 },
      );
    }

    const snapshot = await sectionRef
      .collection("resources")
      .orderBy("order", "asc")
      .get();

    const resources = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ resources });
  } catch (error) {
    console.error("Failed to fetch resources:", error);

    return NextResponse.json(
      { error: "Unable to load resources." },
      { status: 500 },
    );
  }
}

