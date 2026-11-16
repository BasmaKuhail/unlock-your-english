import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { getSectionStates } from "./progression";
import type { LearnerDashboardData } from "./types";
import type { LevelResource } from "@/lib/admin/types";

export class LearnerAccessError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "LearnerAccessError";
  }
}

export async function requireLearner(authorization: string | null) {
  const token = authorization?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) throw new LearnerAccessError("Please sign in to continue.", 401);
  let uid: string;
  try {
    uid = (await adminAuth.verifyIdToken(token, true)).uid;
  } catch {
    throw new LearnerAccessError("Your session expired. Please sign in again.", 401);
  }
  const ref = adminDb.collection("users").doc(uid);
  const snapshot = await ref.get();
  const student = snapshot.data();
  if (!student || student.role !== "student" || student.status !== "active") {
    throw new LearnerAccessError("Your learning account is unavailable. Please contact your teacher.", 403);
  }
  return { uid, ref, student };
}

function stringIds(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
}

export async function loadDashboard(authorization: string | null): Promise<LearnerDashboardData> {
  const { ref, student } = await requireLearner(authorization);
  const history = await ref.collection("learningProgress").get();
  const progress = new Map(history.docs.map((doc) => [doc.id, stringIds(doc.get("completedSectionIds"))]));
  const levelIds = new Set(progress.keys());
  if (typeof student.currentLevelId === "string") levelIds.add(student.currentLevelId);
  const levels = await Promise.all([...levelIds].map(async (id) => {
    const levelRef = adminDb.collection("levels").doc(id);
    const [level, sections] = await Promise.all([levelRef.get(), levelRef.collection("sections").orderBy("order").get()]);
    if (!level.exists) return null;
    const isCurrent = id === student.currentLevelId;
    const available = level.get("isOpen") === true && (!isCurrent || student.levelOpen === true);
    const states = getSectionStates(sections.docs.map((section) => ({ id: section.id, isOpen: section.get("isOpen") === true })), progress.get(id) ?? [], available);
    return {
      id, title: String(level.get("title") ?? "Learning level"), description: String(level.get("description") ?? ""),
      isCurrent, available,
      sections: await Promise.all(sections.docs.map(async (section, index) => {
        const state = !isCurrent && states[index] !== "completed" ? "locked" : states[index];
        const resources = state === "locked" ? [] : (await section.ref.collection("resources").orderBy("order").get()).docs.map((resource) => {
          const data = resource.data();
          // Storage keys stay on the server. Files are opened through the access endpoint.
          const { storagePath: _storagePath, ...publicData } = data;
          void _storagePath;
          return { ...publicData, id: resource.id, storagePath: "" } as LevelResource;
        });
        return { id: section.id, title: String(section.get("title") ?? "Section"), state, resources };
      })),
    };
  }));
  return {
    student: { name: String(student.name ?? "Learner"), studentId: String(student.studentId ?? "") },
    levels: levels.filter((level) => level !== null).sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent)),
  };
}

export async function completeSection(authorization: string | null, levelId: string, sectionId: string) {
  const { ref } = await requireLearner(authorization);
  const levelRef = adminDb.collection("levels").doc(levelId);
  const progressRef = ref.collection("learningProgress").doc(levelId);
  await adminDb.runTransaction(async (transaction) => {
    const [studentDoc, level, sections, progress] = await Promise.all([
      transaction.get(ref), transaction.get(levelRef),
      transaction.get(levelRef.collection("sections").orderBy("order")), transaction.get(progressRef),
    ]);
    const student = studentDoc.data();
    if (student?.role !== "student" || student.status !== "active" || student.currentLevelId !== levelId || student.levelOpen !== true || level.get("isOpen") !== true) {
      throw new LearnerAccessError("This level is not available for completion.", 403);
    }
    const index = sections.docs.findIndex((section) => section.id === sectionId);
    if (index < 0) throw new LearnerAccessError("Section not found.", 404);
    const completed = stringIds(progress.get("completedSectionIds"));
    const states = getSectionStates(sections.docs.map((section) => ({ id: section.id, isOpen: section.get("isOpen") === true })), completed, true);
    if (states[index] === "locked") throw new LearnerAccessError("Finish the previous section first, or ask your teacher to open this section.", 403);
    if (states[index] === "completed") return;
    const resources = await transaction.get(sections.docs[index].ref.collection("resources").limit(1));
    if (resources.empty) throw new LearnerAccessError("Your teacher is still preparing this section’s resources.", 403);
    transaction.set(progressRef, {
      completedSectionIds: [...completed, sectionId], updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  });
}
