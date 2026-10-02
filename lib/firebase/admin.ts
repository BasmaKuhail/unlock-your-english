import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ?.replace(/^["']|["']$/g, "")
  .replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  throw new Error("Missing Firebase Admin environment variables.");
}
console.log("Firebase Admin environment:", {
  hasProjectId: Boolean(projectId),
  hasClientEmail: Boolean(clientEmail),
  hasPrivateKey: Boolean(privateKey),
  privateKeyLength: privateKey?.length,
  startsCorrectly: privateKey?.startsWith(
    "-----BEGIN PRIVATE KEY-----",
  ),
  endsCorrectly: privateKey
    ?.trim()
    .endsWith("-----END PRIVATE KEY-----"),
  containsRealNewlines: privateKey?.includes("\n"),
  containsEscapedNewlines: privateKey?.includes("\\n"),
});

const adminApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    : getApps()[0];

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);