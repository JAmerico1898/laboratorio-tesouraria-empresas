"use client";

import { useState } from "react";
import Link from "next/link";
import { strings } from "@/lib/strings";
import { MODULE_3_SCENARIOS } from "@/data/scenarios";
import { ScenarioPlayer } from "@/components/scenario/scenario-player";
import { ScenarioCard } from "@/components/scenario/scenario-card";
import { useCompletedScenarios } from "@/hooks/use-completed-scenarios";
import type { Scenario, CompletedScenario } from "@/types/scenario";

const OBJECTIVES = [
  "Posicionar o estoque como componente sensível da NCG e do ciclo financeiro.",
  "Distinguir tipos e custos de estoque (carregamento, pedido, ruptura) e aplicar a Curva ABC.",
  "Calcular e aplicar o EOQ, reconhecendo premissas, descontos por volume e fretes.",
  "Dimensionar estoque de segurança e ponto de ressuprimento em cadeias com lead time variável.",
  "Avaliar a adoção de Just-in-Time considerando pré-requisitos operacionais e organizacionais.",
];

export default function Modulo3Page() {
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
          Módulo 3
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
          Gestão de estoques
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
          {MODULE_3_SCENARIOS.map((s) => (
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
