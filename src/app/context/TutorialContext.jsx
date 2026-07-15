import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { TUTORIALS } from "../data/tutorialContent";

const STORAGE_KEY = "tutorial-progress";
const FIRST_VISIT_KEY = "tutorial-first-visit-done";

const TUTORIAL_KEYS = Object.keys(TUTORIALS);

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const TutorialContext = createContext(null);

export function TutorialProvider({ children }) {
  const [completed, setCompleted] = useState(() => loadProgress());
  const [firstVisit, setFirstVisit] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(FIRST_VISIT_KEY);
    if (!done) {
      setFirstVisit(true);
      localStorage.setItem(FIRST_VISIT_KEY, "1");
    }
  }, []);

  const markComplete = useCallback((tutorialKey) => {
    setCompleted((prev) => {
      const next = { ...prev, [tutorialKey]: true };
      saveProgress(next);
      return next;
    });
  }, []);

  const isComplete = useCallback((tutorialKey) => {
    return !!completed[tutorialKey];
  }, [completed]);

  const resetTutorial = useCallback((tutorialKey) => {
    setCompleted((prev) => {
      const next = { ...prev };
      delete next[tutorialKey];
      saveProgress(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setCompleted({});
    saveProgress({});
  }, []);

  const totalTutorials = TUTORIAL_KEYS.length;
  const completedCount = TUTORIAL_KEYS.filter((k) => completed[k]).length;
  const progressPercent = totalTutorials > 0 ? Math.round((completedCount / totalTutorials) * 100) : 0;

  const dismissFirstVisit = useCallback(() => {
    setFirstVisit(false);
  }, []);

  return (
    <TutorialContext.Provider
      value={{
        completed,
        completedCount,
        totalTutorials,
        progressPercent,
        firstVisit,
        markComplete,
        isComplete,
        resetTutorial,
        resetAll,
        dismissFirstVisit,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error("useTutorial must be used within TutorialProvider");
  return ctx;
}
