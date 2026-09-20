import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccountPath = path.join(
  process.cwd(),
  "private",
  "firebase-service-account.json",
);

const serviceAccount = JSON.parse(
  readFileSync(serviceAccountPath, "utf8"),
);

const adminApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);