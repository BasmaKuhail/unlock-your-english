import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/lib/firebase/client";

type SignInWithLearnerIdInput = {
  learnerId: string;
  password: string;
};

export function learnerIdToEmail(learnerId: string) {
  return `${learnerId.trim().toLowerCase()}@students.uye.local`;
}

export async function signInWithLearnerId({ learnerId, password }: SignInWithLearnerIdInput) {
  return signInWithEmailAndPassword(auth, learnerIdToEmail(learnerId), password);
}
