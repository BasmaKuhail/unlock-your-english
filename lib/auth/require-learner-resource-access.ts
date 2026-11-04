import "server-only";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { ResourceType } from "@/lib/admin/types";
import { getSectionStates } from "@/lib/learner/progression";

type ResourceLocation = {
  levelId: string;
  sectionId: string;
  resourceId: string;
};

type AccessibleResource = {
  type: Extract<ResourceType, "file" | "voice" | "image">;
  storagePath: string;
  mimeType: string;
  fileName: string;
};

export class LearnerAccessError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "LearnerAccessError";
  }
}

export async function requireLearnerResourceAccess(
  authorizationHeader: string | null,
  { levelId, sectionId, resourceId }: ResourceLocation,
): Promise<AccessibleResource> {
  const token = authorizationHeader?.match(/^Bearer (.+)$/i)?.[1];

  if (!token) {
    throw new LearnerAccessError("Authentication required.", 401);
  }

  let uid: string;

  try {
    const decodedToken = await adminAuth.verifyIdToken(token, true);
    uid = decodedToken.uid;
  } catch {
    throw new LearnerAccessError("Invalid or expired session.", 401);
  }

  const studentSnapshot = await adminDb.collection("users").doc(uid).get();
  const student = studentSnapshot.data();

  if (
    !studentSnapshot.exists ||
    student?.role !== "student" ||
    student.status !== "active"
  ) {
    throw new LearnerAccessError("Student access denied.", 403);
  }

  const progress = await studentSnapshot.ref.collection("learningProgress").doc(levelId).get();
  const completed: string[] = Array.isArray(progress.get("completedSectionIds")) ? progress.get("completedSectionIds") : [];
  const isCurrent = student.currentLevelId === levelId;
  if ((isCurrent && student.levelOpen !== true) || (!isCurrent && !completed.includes(sectionId))) {
    throw new LearnerAccessError("Level access denied.", 403);
  }

  const levelRef = adminDb.collection("levels").doc(levelId);
  const sectionRef = levelRef.collection("sections").doc(sectionId);
  const resourceRef = sectionRef.collection("resources").doc(resourceId);

  const [levelSnapshot, sectionSnapshot, resourceSnapshot] =
    await Promise.all([
      levelRef.get(),
      sectionRef.get(),
      resourceRef.get(),
    ]);

  if (
    !levelSnapshot.exists ||
    levelSnapshot.get("isOpen") !== true ||
    !sectionSnapshot.exists ||
    sectionSnapshot.get("isOpen") !== true
  ) {
    throw new LearnerAccessError("Learning material unavailable.", 403);
  }

  const sections = await levelRef.collection("sections").orderBy("order").get();
  const states = getSectionStates(sections.docs.map((section) => ({ id: section.id, isOpen: section.get("isOpen") === true })), completed, true);
  const sectionIndex = sections.docs.findIndex((section) => section.id === sectionId);
  if (sectionIndex < 0 || states[sectionIndex] === "locked") {
    throw new LearnerAccessError("Finish the previous section first.", 403);
  }

  if (!resourceSnapshot.exists) {
    throw new LearnerAccessError("Resource not found.", 404);
  }

  const resource = resourceSnapshot.data();
  const type = resource?.type;

  if (type !== "file" && type !== "voice" && type !== "image") {
    throw new LearnerAccessError("Resource is not a stored file.", 400);
  }
  if(!resource){
    throw new LearnerAccessError("Resource data is missing.", 400);
  }
  if (
    typeof resource.storagePath !== "string" ||
    !resource.storagePath.startsWith(`level-resources/${type}/`) ||
    resource.storagePath.endsWith("/")
  ) {
    throw new LearnerAccessError("Invalid resource storage path.", 400);
  }

  return {
    type,
    storagePath: resource.storagePath,
    mimeType:
      typeof resource.mimeType === "string"
        ? resource.mimeType
        : "application/octet-stream",
    fileName:
      typeof resource.fileName === "string"
        ? resource.fileName
        : "resource",
  };
}
