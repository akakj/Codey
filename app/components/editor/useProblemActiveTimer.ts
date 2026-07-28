"use client";

import * as React from "react";

const STORAGE_PREFIX = "Codey:activeProblemTime";

export function useProblemActiveTimer(problemSlug: string) {
  const storageKey = `${STORAGE_PREFIX}:${problemSlug}`;

  const elapsedMsRef = React.useRef(0); // time from the previously completed active periods
  const startedAtRef = React.useRef<number | null>(null); // timestamp when the current active period started, or null if not active
  const pausedForSubmissionRef = React.useRef(false);

  const getCurrentElapsedMs = React.useCallback(() => {
    const currentSegment =
      startedAtRef.current === null
        ? 0
        : Date.now() - startedAtRef.current;

    return elapsedMsRef.current + currentSegment; // total elapsed time including the current active period
  }, []);

  const persist = React.useCallback(() => {
    try {
      sessionStorage.setItem(
        storageKey,
        String(getCurrentElapsedMs()),
      );
    } catch {
      // Timing still works when sessionStorage is unavailable.
    }
  }, [getCurrentElapsedMs, storageKey]);

  // Calculate how much time passed during the current active period
  const pause = React.useCallback(() => {
    if (startedAtRef.current !== null) {
      elapsedMsRef.current +=
        Date.now() - startedAtRef.current;

      startedAtRef.current = null;
    }

    persist();
  }, [persist]);

  // Start a new active period
  const resume = React.useCallback(() => {
    if (pausedForSubmissionRef.current) {
      return;
    }

    const tabIsActive =
      document.visibilityState === "visible" &&
      document.hasFocus();

    if (!tabIsActive || startedAtRef.current !== null) {
      return;
    }

    startedAtRef.current = Date.now();
  }, []);

  React.useEffect(() => {
    elapsedMsRef.current = 0;
    startedAtRef.current = null;
    pausedForSubmissionRef.current = false;

    try {
      const storedValue = sessionStorage.getItem(storageKey);
      const storedElapsedMs = Number(storedValue);

      if (
        Number.isFinite(storedElapsedMs) &&
        storedElapsedMs >= 0
      ) {
        elapsedMsRef.current = storedElapsedMs;
      }
    } catch {
      // Start from zero when storage cannot be read.
    }

    const syncTimerWithPageState = () => {
      const tabIsActive =
        document.visibilityState === "visible" &&
        document.hasFocus();

      if (tabIsActive) {
        resume();
      } else {
        pause();
      }
    };

    syncTimerWithPageState();

    document.addEventListener(
      "visibilitychange",
      syncTimerWithPageState,
    );

    window.addEventListener(
      "focus",
      syncTimerWithPageState,
    );

    window.addEventListener(
      "blur",
      syncTimerWithPageState,
    );

    window.addEventListener("pagehide", pause);

    const persistenceInterval = window.setInterval(
      persist,
      5000,
    );

    return () => {
      pause();

      document.removeEventListener(
        "visibilitychange",
        syncTimerWithPageState,
      );

      window.removeEventListener(
        "focus",
        syncTimerWithPageState,
      );

      window.removeEventListener(
        "blur",
        syncTimerWithPageState,
      );

      window.removeEventListener("pagehide", pause);
      window.clearInterval(persistenceInterval);
    };
  }, [pause, persist, resume, storageKey]);

  const stopForSubmission = React.useCallback(() => {
    pause();
    pausedForSubmissionRef.current = true;

    return Math.floor(elapsedMsRef.current / 1000);
  }, [pause]);

  const resumeAfterFailedSubmission = React.useCallback(() => {
    pausedForSubmissionRef.current = false;
    resume();
  }, [resume]);

  const startNextAttempt = React.useCallback(() => {
    elapsedMsRef.current = 0;
    startedAtRef.current = null;
    pausedForSubmissionRef.current = false;

    try {
      sessionStorage.removeItem(storageKey);
    } catch {}

    resume();
  }, [resume, storageKey]);

  return {
    stopForSubmission,
    resumeAfterFailedSubmission,
    startNextAttempt,
  };
}