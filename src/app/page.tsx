"use client";

import Link from "next/link";
import { strings } from "@/lib/strings";
import { useCompletedScenarios } from "@/hooks/use-completed-scenarios";
import {
  MODULE_1_SCENARIOS,
  MODULE_2_SCENARIOS,
  MODULE_3_SCENARIOS,
  MODULE_4_SCENARIOS,
  MODULE_5_SCENARIOS,
} from "@/data/scenarios";
import type { Scenario } from "@/types/scenario";

interface ModuleInfo {
  id: string;
  number: number;
  title: string;
  href: string;
  description: string;
  icon: string;
  scenarios: Scenario[];
}

const MODULES: ModuleInfo[] = [
  {
    id: "m1",
    number: 1,
    title: "Fundamentos do capital de giro",
    href: "/modulo-1",
    description:
      "NCG, CCL, Saldo de Tesouraria e ciclo financeiro pelo modelo Fleuriet — diagnóstico financeiro de curto prazo.",
    icon: "account_balance",
    scenarios: MODULE_1_SCENARIOS,
  },
  {
    id: "m2",
    number: 2,
    title: "Orçamento de caixa",
    href: "/modulo-2",
    description:
      "Planejamento mensal, modelo preditivo de gaps, gestão de excedentes e fontes de funding em janela curta.",
    icon: "calendar_month",
    scenarios: MODULE_2_SCENARIOS,
  },
  {
    id: "m3",
    number: 3,
    title: "Gestão de estoques",
    href: "/modulo-3",
    description:
      "Curva ABC, EOQ, estoque de segurança em cadeias internacionais e decisão de adoção de JIT.",
    icon: "inventory_2",
    scenarios: MODULE_3_SCENARIOS,
  },
  {
    id: "m4",
    number: 4,
    title: "Gestão de contas a receber",
    href: "/modulo-4",
    description:
      "Política de crédito, 5 Cs, cobrança escalonada e antecipação via banco × FIDC.",
    icon: "receipt_long",
    scenarios: MODULE_4_SCENARIOS,
  },
  {
    id: "m5",
    number: 5,
    title: "Gestão de fornecedores e passivos CP",
    href: "/modulo-5",
    description:
      "Crédito comercial como funding, CET de alternativas, vendor finance e gestão de covenants.",
    icon: "handshake",
    scenarios: MODULE_5_SCENARIOS,
  },
];

export default function HomePage() {
  const { completedScenarios } = useCompletedScenarios();

  function moduleProgress(scenarios: Scenario[]) {
    const ids = new Set(scenarios.map((s) => s.id));
    const completed = completedScenarios.filter((c) => ids.has(c.simId)).length;
    return { completed, total: scenarios.length };
  }

  return (
    <div>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <h1 className="font-heading text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-4">
          {strings.heroTitle}
        </h1>
        <p className="text-lg text-on-surface-variant mb-2">
          {strings.professor}
        </p>
        <p className="text-base text-on-surface/80 max-w-2xl leading-relaxed mt-6">
          {strings.heroPitch}
        </p>
      </section>

      {/* Methodology */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-heading font-bold text-primary">
              {strings.methodologyTitle}
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 space-y-6">
              <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-3xl">topic</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary font-heading">
                  {strings.methodStep1Title}
                </h3>
                <p className="text-on-surface-variant">
                  {strings.methodStep1Text}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center p-8 space-y-6">
              <div className="w-16 h-16 bg-secondary text-on-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-3xl">
                  account_tree
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary font-heading">
                  {strings.methodStep2Title}
                </h3>
                <p className="text-on-surface-variant">
                  {strings.methodStep2Text}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center p-8 space-y-6">
              <div className="w-16 h-16 bg-tertiary-container text-on-tertiary-container rounded-2xl flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-3xl">
                  school
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary font-heading">
                  {strings.methodStep3Title}
                </h3>
                <p className="text-on-surface-variant">
                  {strings.methodStep3Text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16">
            <h2 className="text-4xl font-heading font-bold text-primary tracking-tight">
              {strings.modulesAccessTitle}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MODULES.map((m) => {
              const progress = moduleProgress(m.scenarios);
              const pct =
                progress.total > 0
                  ? (progress.completed / progress.total) * 100
                  : 0;

              return (
                <Link key={m.id} href={m.href} className="block">
                  <div className="group cursor-pointer bg-surface-container-lowest rounded-xl p-8 hover:shadow-[0_12px_32px_rgba(25,28,29,0.06)] transition-all duration-300 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
                    <div className="space-y-4 relative z-10">
                      <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                        <span className="material-symbols-outlined">
                          {m.icon}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-primary font-heading leading-tight">
                        {m.title}
                      </h3>
                      <p className="text-on-surface-variant leading-relaxed text-sm">
                        {m.description}
                      </p>
                    </div>
                    <div className="mt-8 relative z-10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          {strings.progressLabel}
                        </span>
                        <span className="text-xs font-bold text-secondary">
                          {progress.completed}/{progress.total}{" "}
                          {strings.concluidos}
                        </span>
                      </div>
                      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-secondary-fixed-dim h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* 6th card — Estudos de Caso */}
            <Link href="/estudos-de-caso" className="block">
              <div className="group cursor-pointer bg-tertiary-container text-white rounded-xl p-8 hover:shadow-[0_12px_32px_rgba(25,28,29,0.06)] transition-all duration-300 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-tertiary-fixed text-on-tertiary-fixed rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined">menu_book</span>
                  </div>
                  <h3 className="text-xl font-bold text-tertiary-fixed font-heading leading-tight">
                    Estudos de Caso
                  </h3>
                  <p className="text-white/85 leading-relaxed text-sm">
                    Cinco casos abertos — um por módulo — para aplicar de ponta a
                    ponta os conceitos do curso: diagnóstico, plano e
                    entregáveis.
                  </p>
                </div>
                <div className="mt-8 relative z-10 flex items-center gap-2 font-bold text-sm text-tertiary-fixed-dim group-hover:translate-x-1 transition-transform">
                  <span>Acessar casos</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
