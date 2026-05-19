"use client";

import { useState, useEffect } from "react";
import type { CompletedScenario } from "@/types/scenario";

const STORAGE_KEY = "tesouraria_lab_completed_v1";

export function useCompletedScenarios() {
  const [completedScenarios, setCompletedScenarios] = useState<CompletedScenario[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CompletedScenario[];
        setCompletedScenarios(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const addCompletedScenario = (scenario: CompletedScenario) => {
    setCompletedScenarios((prev) => {
      const next = [...prev.filter((c) => c.simId !== scenario.simId), scenario];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const getCompletedScenarios = (): CompletedScenario[] => completedScenarios;

  return {
    completedScenarios,
    addCompletedScenario,
    getCompletedScenarios,
  };
}
