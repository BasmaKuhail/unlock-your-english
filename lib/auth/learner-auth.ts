import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/lib/firebase/client";
import {
  LearnerSessionPersistenceError,
  type LearnerSession,
  restoreLearnerSession,
  startLearnerSession,
} from "@/lib/auth/learner-session";

type SignInWithLearnerIdInput = {
  learnerId: string;
  password: string;
};

export function learnerIdToEmail(learnerId: string) {
  return `${learnerId.trim().toLowerCase()}@students.uye.local`;
}

export async function signInWithLearnerId({ learnerId, password }: SignInWithLearnerIdInput) {
  const email = learnerIdToEmail(learnerId);

  // Use Firebase's managed persistence instead of handling credentials in
  // localStorage ourselves. The accompanying record only limits its lifetime.
  let previousSession: LearnerSession | null;

  try {
    await setPersistence(auth, browserLocalPersistence);
    previousSession = startLearnerSession(email);
  } catch {
    throw new LearnerSessionPersistenceError();
  }

  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    restoreLearnerSession(previousSession);
    throw error;
  }
}
