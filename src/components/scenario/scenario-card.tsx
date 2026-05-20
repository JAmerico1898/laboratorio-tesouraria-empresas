"use client";

import { strings } from "@/lib/strings";
import type { Scenario, CompletedScenario } from "@/types/scenario";

function getDifficultyStyles(difficulty: Scenario["difficulty"]) {
  if (difficulty === "Avançado") {
    return {
      card: "bg-surface-container-highest shadow-sm hover:shadow-md",
      badge: "bg-primary text-white",
      title: "text-primary",
      narrative: "text-on-surface-variant",
      cta: "text-primary",
      ctaBg: false,
    };
  }
  // Fácil + Intermediário
  return {
    card: "bg-surface-container-lowest shadow-sm hover:shadow-md",
    badge: "bg-secondary-container text-on-secondary-container",
    title: "text-primary",
    narrative: "text-on-surface-variant",
    cta: "bg-primary text-on-primary hover:bg-primary-container",
    ctaBg: true,
  };
}

interface ScenarioCardProps {
  scenario: Scenario;
  completed?: CompletedScenario;
  onClick: () => void;
}

export function ScenarioCard({ scenario, completed, onClick }: ScenarioCardProps) {
  const s = getDifficultyStyles(scenario.difficulty);
  const cleanNarrative = scenario.context.narrative.replace(/\*\*/g, "");

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-8 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[320px] cursor-pointer ${s.card}`}
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500" />
      <div className="relative">
        <div className="flex justify-between items-start mb-6 gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.badge}`}
          >
            {scenario.difficulty}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
              {scenario.code} · {scenario.estimatedMinutes} {strings.estimatedMinutes}
            </span>
            {completed && (
              <span className="flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-[10px] font-bold">
                ✓ {completed.score}/{completed.maxScore}
              </span>
            )}
          </div>
        </div>
        <h3 className={`font-heading text-2xl font-bold mb-4 leading-tight ${s.title}`}>
          {scenario.title}
        </h3>
        <p className={`text-sm leading-relaxed line-clamp-5 ${s.narrative}`}>
          {cleanNarrative}
        </p>
      </div>
      {s.ctaBg ? (
        <button
          onClick={onClick}
          className={`mt-8 w-fit px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors active:scale-95 cursor-pointer ${s.cta}`}
        >
          {strings.startScenario}
          <span>→</span>
        </button>
      ) : (
        <div
          className={`mt-8 flex items-center justify-between font-bold text-sm group-hover:translate-x-1 transition-transform ${s.cta}`}
        >
          <span>{strings.startScenario}</span>
          <span>→</span>
        </div>
      )}
    </div>
  );
}
