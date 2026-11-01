
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { adminDb } from "@/lib/firebase/admin";
import { b2, B2_BUCKET_NAME } from "@/lib/storage/b2";

type RouteContext = {
  params: Promise<{
    levelId: string;
    sectionId: string;
    resourceId: string;
  }>;
};

export async function GET(
  _request: Request,
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

    const { levelId, sectionId, resourceId } = await params;

    const resourceRef = adminDb
      .collection("levels")
      .doc(levelId)
      .collection("sections")
      .doc(sectionId)
      .collection("resources")
      .doc(resourceId);

    const resourceSnapshot = await resourceRef.get();

    if (!resourceSnapshot.exists) {
      return NextResponse.json(
        { error: "Resource not found." },
        { status: 404 },
      );
    }

    const resource = resourceSnapshot.data();

    if (
      resource?.type !== "image" ||
      typeof resource.storagePath !== "string" ||
      !resource.storagePath.startsWith("level-resources/image/")
    ) {
      return NextResponse.json(
        { error: "Invalid image resource." },
        { status: 400 },
      );
    }

    const command = new GetObjectCommand({
      Bucket: B2_BUCKET_NAME,
      Key: resource.storagePath,
    });

    const url = await getSignedUrl(b2, command, {
      expiresIn: 300,
    });

    return NextResponse.json(
      { url },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error("Unable to generate image preview:", error);

    return NextResponse.json(
      { error: "Unable to load image preview." },
      { status: 500 },
    );
  }
}
