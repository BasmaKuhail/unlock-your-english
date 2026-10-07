import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminStorage } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function safeFileName(name: string) {
  const extension = name.includes(".") ? `.${name.split(".").pop()}` : "";
  return `${randomUUID()}${extension.toLowerCase().replace(/[^.a-z0-9]/g, "")}`;
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const resourceType = formData.get("resourceType");

    if (!(file instanceof File) || (resourceType !== "file" && resourceType !== "voice")) {
      return NextResponse.json({ error: "Choose a valid file." }, { status: 400 });
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Files must be between 1 byte and 20 MB." },
        { status: 400 },
      );
    }

    if (resourceType === "voice" && !file.type.startsWith("audio/")) {
      return NextResponse.json(
        { error: "Voice documents must be audio files." },
        { status: 400 },
      );
    }

    const bucketName =
      process.env.FIREBASE_STORAGE_BUCKET ??
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (!bucketName) {
      return NextResponse.json(
        { error: "File storage has not been configured." },
        { status: 503 },
      );
    }

    const storagePath = `level-resources/${resourceType}/${safeFileName(file.name)}`;
    const storageFile = adminStorage.bucket(bucketName).file(storagePath);

    await storageFile.save(Buffer.from(await file.arrayBuffer()), {
      contentType: file.type || "application/octet-stream",
      resumable: false,
      metadata: {
        metadata: {
          originalFileName: file.name,
          uploadedBy: admin.uid,
        },
      },
    });

    return NextResponse.json({
      resource: {
        fileName: file.name,
        storagePath,
        mimeType: file.type || "application/octet-stream",
      },
    });
  } catch (error) {
    console.error("Failed to upload level resource:", error);

    return NextResponse.json(
      { error: "Unable to upload the file." },
      { status: 500 },
    );
  }
}
