"use client";

/**
 * This record intentionally contains no Firebase credentials. Firebase keeps
 * those credentials in its own persistence layer; this only supplies a fixed
 * expiry for the remembered learner session.
 */
export const LEARNER_SESSION_STORAGE_KEY = "uye.learner-session.v1";
export const LEARNER_SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export class LearnerSessionPersistenceError extends Error {
  constructor() {
    super("Unable to persist the learner session.");
    this.name = "LearnerSessionPersistenceError";
  }
}

export type LearnerSession = {
  email: string;
  expiresAt: number;
};

function normaliseEmail(email: string) {
  return email.trim().toLowerCase();
}

function isLearnerSession(value: unknown): value is LearnerSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Record<string, unknown>;

  return (
    typeof session.email === "string" &&
    typeof session.expiresAt === "number" &&
    Number.isFinite(session.expiresAt)
  );
}

function readLearnerSession(): LearnerSession | null {
  try {
    const rawSession = window.localStorage.getItem(LEARNER_SESSION_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    const session: unknown = JSON.parse(rawSession);

    if (!isLearnerSession(session)) {
      clearLearnerSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

function writeLearnerSession(session: LearnerSession) {
  window.localStorage.setItem(LEARNER_SESSION_STORAGE_KEY, JSON.stringify(session));
}

/** Starts a new fixed-length remembered session without storing an auth token. */
export function startLearnerSession(email: string) {
  const previousSession = readLearnerSession();
  const session: LearnerSession = {
    email: normaliseEmail(email),
    expiresAt: Date.now() + LEARNER_SESSION_DURATION_MS,
  };

  writeLearnerSession(session);

  return previousSession;
}

export function restoreLearnerSession(session: LearnerSession | null) {
  if (session) {
    writeLearnerSession(session);
    return;
  }

  clearLearnerSession();
}

export function clearLearnerSession() {
  try {
    window.localStorage.removeItem(LEARNER_SESSION_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

export function getLearnerSessionExpiry(email: string) {
  const session = readLearnerSession();

  if (
    !session ||
    session.email !== normaliseEmail(email) ||
    session.expiresAt <= Date.now()
  ) {
    return null;
  }

  return session.expiresAt;
}
