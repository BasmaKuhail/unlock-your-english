"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { clearLearnerSession } from "@/lib/auth/learner-session";
import { learnerRequest } from "@/lib/learner/api";
import { completedSectionFeedback, type ProgressFeedback } from "@/lib/learner/progress-feedback";
import type { LearnerDashboardData } from "@/lib/learner/types";

export function useStudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<LearnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<ProgressFeedback | null>(null);
  const [selectedLevelId, selectLevel] = useState<string | null>(null);
  const [selectedSectionId, selectSection] = useState<string | null>(null);
  const requestVersion = useRef(0);
  const invalidateRequests = useCallback(() => { requestVersion.current++; }, []);

  const reload = useCallback(async () => {
    const version = ++requestVersion.current;
    setError(null);
    setLoading(true);
    try {
      const next = await learnerRequest<LearnerDashboardData>("/api/learner/dashboard");
      if (version === requestVersion.current) setData(next);
    } catch (error) {
      if (version === requestVersion.current) setError(error instanceof Error ? error.message : "Unable to load your dashboard.");
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        requestVersion.current++;
        setData(null);
        router.replace("/login");
        return;
      }
      void reload();
    });
    return () => { unsubscribe(); invalidateRequests(); };
  }, [reload, router, invalidateRequests]);

  const level = data?.levels.find((item) => item.id === selectedLevelId) ?? data?.levels[0];
  const section = level?.sections.find((item) => item.id === selectedSectionId && item.state !== "locked");
  const nextSection = level?.sections.find((item) => item.state === "available");

  async function complete() {
    if (!level || !section || saving) return;
    setSaving(true);
    setError(null);
    try {
      await learnerRequest("/api/learner/progress", { method: "POST", body: JSON.stringify({ levelId: level.id, sectionId: section.id }) });
      try {
        const next = await learnerRequest<LearnerDashboardData>("/api/learner/dashboard");
        const updatedLevel = next.levels.find((item) => item.id === level.id);
        setData(next);
        selectSection(null);
        setFeedback(completedSectionFeedback(updatedLevel, level.title, section.title));
      } catch {
        // The save succeeded, even if fetching the updated map did not.
        setData((current) => current && ({ ...current, levels: current.levels.map((item) => item.id !== level.id ? item : { ...item, sections: item.sections.map((entry) => entry.id === section.id ? { ...entry, state: "completed" } : entry) }) }));
        setFeedback({ kind: "refresh-error", title: "Your progress is saved", message: "We couldn’t refresh your learning map. Refresh the dashboard to see your latest progress." });
      }
    } catch (error) {
      setFeedback({ kind: "save-error", title: "Let’s try that again", message: error instanceof Error ? error.message : "Unable to save your progress. Please try again." });
    } finally { setSaving(false); }
  }

  async function logout() {
    try {
      await signOut(auth);
      clearLearnerSession();
      router.replace("/login");
    } catch { setError("Unable to sign out. Please try again."); }
  }

  return { data, loading, error, saving, feedback, dismissFeedback: () => setFeedback(null), level, section, nextSection, reload, complete, logout,
    selectLevel: (id: string) => { selectLevel(id); selectSection(null); },
    selectSection: (id: string | null) => { selectSection(id); },
  };
}
