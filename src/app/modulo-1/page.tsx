"use client";

import { useState } from "react";
import Link from "next/link";
import { strings } from "@/lib/strings";
import { MODULE_1_SCENARIOS } from "@/data/scenarios";
import { ScenarioPlayer } from "@/components/scenario/scenario-player";
import { ScenarioCard } from "@/components/scenario/scenario-card";
import { useCompletedScenarios } from "@/hooks/use-completed-scenarios";
import type { Scenario, CompletedScenario } from "@/types/scenario";

const OBJECTIVES = [
  "Compreender o conceito de capital de giro e sua importância na gestão financeira.",
  "Distinguir capital de giro líquido, necessidade de capital de giro e tesouraria.",
  "Calcular e interpretar o ciclo operacional e o ciclo financeiro de uma empresa.",
  "Identificar os fatores que influenciam o capital de giro em diferentes setores.",
];

export default function Modulo1Page() {
  const [active, setActive] = useState<Scenario | null>(null);
  const { completedScenarios, addCompletedScenario } = useCompletedScenarios();

  function handleFinish(result: CompletedScenario) {
    addCompletedScenario(result);
    setActive(null);
  }

  if (active) {
    return (
      <ScenarioPlayer
        scenario={active}
        onFinish={handleFinish}
        onBack={() => setActive(null)}
      />
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-20">
        <Link
          href="/"
          className="inline-block text-xs text-muted hover:text-accent mb-8 transition-colors"
        >
          {strings.backHome}
        </Link>

        <div className="text-xs uppercase tracking-[0.18em] text-accent mb-3 font-semibold">
          Módulo 1
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
          Fundamentos do capital de giro
        </h1>

        <div className="bg-surface border border-border-soft rounded-lg p-6 mb-10">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-3">
            {strings.objetivosAprendizagem}
          </div>
          <ul className="space-y-2 text-[15px] leading-relaxed">
            {OBJECTIVES.map((o, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent shrink-0">•</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs uppercase tracking-[0.18em] text-accent mb-4 font-semibold">
          {strings.scenariosTitle}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MODULE_1_SCENARIOS.map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              completed={completedScenarios.find((c) => c.simId === s.id)}
              onClick={() => setActive(s)}
            />
          ))}
        </div>
      </div>

    </main>
  );
}
