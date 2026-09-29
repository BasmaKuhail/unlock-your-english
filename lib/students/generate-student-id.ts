import "server-only";

import { adminDb } from "@/lib/firebase/admin";

const STUDENT_ID_PREFIX = "UYE";
const STUDENT_ID_PADDING = 4;

export async function generateStudentId(): Promise<string> {
  const counterRef = adminDb.collection("counters").doc("students");

  const studentNumber = await adminDb.runTransaction(async (transaction) => {
    const counterSnapshot = await transaction.get(counterRef);

    if (!counterSnapshot.exists) {
      throw new Error("Student counter does not exist.");
    }

    const current = counterSnapshot.data()?.current;

    if (!Number.isInteger(current) || current < 0) {
      throw new Error("Student counter is invalid.");
    }

    const next = current + 1;

    transaction.update(counterRef, {
      current: next,
    });

    return next;
  });

  return `${STUDENT_ID_PREFIX}-${studentNumber
    .toString()
    .padStart(STUDENT_ID_PADDING, "0")}`;
}