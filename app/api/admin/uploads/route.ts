
import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { b2, B2_BUCKET_NAME } from "@/lib/storage/b2";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function safeFileName(name: string) {
  const extension = name.includes(".")
    ? `.${name.split(".").pop()}`
    : "";

  return `${randomUUID()}${extension
    .toLowerCase()
    .replace(/[^.a-z0-9]/g, "")}`;
}

export async function POST(request: Request) {
  try {
    // 1. Verify administrator
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 401 },
      );
    }

    // 2. Read uploaded file
    const formData = await request.formData();
    const file = formData.get("file");
    const resourceType = formData.get("resourceType");

    if (
      !(file instanceof File) ||
      (resourceType !== "file" && resourceType !== "voice")
    ) {
      return NextResponse.json(
        { error: "Choose a valid file." },
        { status: 400 },
      );
    }

    // 3. Validate size
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Files must be between 1 byte and 20 MB." },
        { status: 400 },
      );
    }

    // 4. Validate voice files
    if (
      resourceType === "voice" &&
      !file.type.startsWith("audio/")
    ) {
      return NextResponse.json(
        { error: "Voice documents must be audio files." },
        { status: 400 },
      );
    }

    // 5. Generate unique object key
    const storagePath =
      `level-resources/${resourceType}/${safeFileName(file.name)}`;

    const mimeType =
      file.type || "application/octet-stream";

    // 6. Upload to Backblaze B2
    await b2.send(
      new PutObjectCommand({
        Bucket: B2_BUCKET_NAME,
        Key: storagePath,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: mimeType,
        Metadata: {
          originalfilename: encodeURIComponent(file.name),
          uploadedby: admin.uid,
        },
      }),
    );

    // 7. Return existing response format
  return NextResponse.json({
    resource: {
      fileName: file.name,
      storagePath,
      mimeType,
      size: file.size,
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
