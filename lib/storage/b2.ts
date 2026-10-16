import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.B2_ENDPOINT;
const region = process.env.B2_REGION;
const accessKeyId = process.env.B2_KEY_ID;
const secretAccessKey = process.env.B2_APPLICATION_KEY;

if (
  !endpoint ||
  !region ||
  !accessKeyId ||
  !secretAccessKey
) {
  throw new Error(
    "Backblaze B2 environment variables are not configured.",
  );
}

export const b2 = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const B2_BUCKET_NAME =
  process.env.B2_BUCKET_NAME;

if (!B2_BUCKET_NAME) {
  throw new Error(
    "B2_BUCKET_NAME is not configured.",
  );
}