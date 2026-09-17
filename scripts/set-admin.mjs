import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFile } from "node:fs/promises";

const serviceAccount = JSON.parse(
  await readFile(
    new URL("../private/firebase-service-account.json", import.meta.url),
    "utf8",
  ),
);

const app = initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth(app);

const adminUid = process.argv[2];

if (!adminUid) {
  throw new Error("Admin UID is required.");
}

await auth.setCustomUserClaims(adminUid, {
  admin: true,
});

console.log(`Admin claim successfully assigned to ${adminUid}.`);