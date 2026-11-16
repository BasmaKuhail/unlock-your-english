import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

import {
  LearnerAccessError,
  requireLearnerResourceAccess,
} from "@/lib/auth/require-learner-resource-access";

// Adjust this import to match your existing B2 client exports.
import { b2, B2_BUCKET_NAME } from "@/lib/storage/b2";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    levelId: string;
    sectionId: string;
    resourceId: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const params = await context.params;

    const resource = await requireLearnerResourceAccess(
      request.headers.get("authorization"),
      params,
    );

    const command = new GetObjectCommand({
      Bucket: B2_BUCKET_NAME,
      Key: resource.storagePath,
    });

    const url = await getSignedUrl(b2, command, {
      expiresIn: 300,
    });

    return NextResponse.json(
      {
        url,
        type: resource.type,
        mimeType: resource.mimeType,
        fileName: resource.fileName,
        expiresIn: 300,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    if (error instanceof LearnerAccessError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Failed to access learner resource:", error);

    return NextResponse.json(
      { error: "Unable to access learning resource." },
      { status: 500 },
    );
  }
}