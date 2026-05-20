"use client";

import { useMemo, useState, useEffect } from "react";
import { strings } from "@/lib/strings";
import { MarkdownText } from "@/components/shared/markdown-text";
import { ScoreBar } from "./score-bar";
import { FinancialStatementTable } from "@/components/financial-statement-table";
import type { Scenario, Choice, Branch, CompletedScenario } from "@/types/scenario";
import { cn } from "@/lib/format";

type Phase = "etapa" | "branch-pick" | "result" | "reflection" | "complete";

interface ScenarioPlayerProps {
  scenario: Scenario;
  onFinish: (result: CompletedScenario) => void;
  onBack: () => void;
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const copy = [...arr];
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  for (let i = copy.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1664525) + 1013904223) | 0;
    const j = (h >>> 0) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface EtapaAnswer {
  etapaId: string;
  choiceId: string;
  scoreEarned: number;
}

export function ScenarioPlayer({ scenario, onFinish, onBack }: ScenarioPlayerProps) {
  const [phase, setPhase] = useState<Phase>("etapa");
  const [etapaIndex, setEtapaIndex] = useState(0);
  const [etapaAnswers, setEtapaAnswers] = useState<EtapaAnswer[]>([]);
  const [chosenBranch, setChosenBranch] = useState<Branch | null>(null);
  const [reflectionChoice, setReflectionChoice] = useState<Choice | null>(null);
  const [lastFeedback, setLastFeedback] = useState<Choice | null>(null);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 30);
    return () => clearTimeout(t);
  }, [phase, etapaIndex]);

  const etapas = scenario.etapas;
  const branches = scenario.branches;
  const currentEtapa = etapas[etapaIndex];

  const etapasMax = etapas.reduce(
    (sum, e) => sum + Math.max(0, ...e.choices.map((c) => c.score)),
    0
  );
  const reflectionMax = Math.max(
    0,
    ...branches.map((b) =>
      Math.max(0, ...b.reflection.choices.map((c) => c.score))
    )
  );
  const maxScore = etapasMax + reflectionMax;

  const etapasScore = etapaAnswers.reduce((sum, a) => sum + a.scoreEarned, 0);
  const reflectionScore = reflectionChoice?.score ?? 0;
  const score = etapasScore + reflectionScore;

  const shuffledChoices = useMemo(() => {
    if (currentEtapa) return seededShuffle(currentEtapa.choices, currentEtapa.id);
    return [];
  }, [currentEtapa]);

  const shuffledReflection = useMemo(() => {
    if (chosenBranch) {
      return seededShuffle(
        chosenBranch.reflection.choices,
        `${chosenBranch.id}_refl`
      );
    }
    return [];
  }, [chosenBranch]);

  const currentEtapaAnswer = etapaAnswers.find(
    (a) => a.etapaId === currentEtapa?.id
  );
  const currentEtapaChoice = currentEtapa?.choices.find(
    (c) => c.id === currentEtapaAnswer?.choiceId
  );

  function handleEtapaChoice(choice: Choice) {
    if (!currentEtapa) return;
    setEtapaAnswers((prev) => {
      const existing = prev.find((a) => a.etapaId === currentEtapa.id);
      const newAnswer: EtapaAnswer = {
        etapaId: currentEtapa.id,
        choiceId: choice.id,
        scoreEarned: choice.score,
      };
      if (existing) {
        return prev.map((a) => (a.etapaId === currentEtapa.id ? newAnswer : a));
      }
      return [...prev, newAnswer];
    });
    setLastFeedback(choice);
    if (etapaIndex < etapas.length - 1) {
      setEtapaIndex(etapaIndex + 1);
    } else {
      setPhase("branch-pick");
    }
  }

  function handleBranchPick(branch: Branch) {
    setChosenBranch(branch);
    setLastFeedback(null);
    setPhase("result");
  }

  function handleReflectionChoice(choice: Choice) {
    setReflectionChoice(choice);
    setLastFeedback(choice);
    setPhase("complete");
  }

  function handleFinish() {
    if (!chosenBranch) return;
    onFinish({
      simId: scenario.id,
      score,
      maxScore,
      branchChosen: chosenBranch.letter,
      completedAt: new Date().toISOString(),
    });
  }

  function handleBackButton() {
    setLastFeedback(null);
    if (phase === "etapa") {
      if (etapaIndex > 0) {
        setEtapaIndex(etapaIndex - 1);
      } else {
        onBack();
      }
    } else if (phase === "branch-pick") {
      setEtapaIndex(etapas.length - 1);
      setPhase("etapa");
    } else if (phase === "result") {
      setChosenBranch(null);
      setPhase("branch-pick");
    } else if (phase === "reflection") {
      setPhase("result");
    } else if (phase === "complete") {
      setPhase("reflection");
    }
  }

  const canGoPrev =
    !(phase === "etapa" && etapaIndex === 0) && phase !== "complete";

  return (
    <div className="min-h-screen px-4 py-10">
      <div
        className={cn(
          "max-w-3xl mx-auto transition-opacity duration-300",
          fadeIn ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="bg-transparent border border-border-soft text-muted hover:text-ink hover:border-ink px-3 py-1.5 rounded-md cursor-pointer text-xs transition-colors"
            >
              {strings.backHome}
            </button>
            {canGoPrev && (
              <button
                onClick={handleBackButton}
                className="bg-transparent border border-secondary/40 text-secondary hover:bg-secondary/10 px-3 py-1.5 rounded-md cursor-pointer text-xs transition-colors"
              >
                {strings.prevStep}
              </button>
            )}
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted uppercase tracking-wider mb-1">
              {strings.score}
            </div>
            <div className="w-[160px]">
              <ScoreBar score={score} maxScore={maxScore} />
            </div>
          </div>
        </div>

        {/* Title block */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-muted">{scenario.code}</span>
          <span className="text-xs text-muted">·</span>
          <span className="text-xs text-muted">{scenario.company}</span>
          <span className="text-xs text-muted">·</span>
          <span className="text-xs px-2 py-0.5 rounded bg-accent-soft text-accent font-semibold">
            {scenario.difficulty}
          </span>
        </div>
        <h2 className="font-heading text-3xl font-bold mb-6 leading-tight">
          {scenario.title}
        </h2>

        {/* Phase progress */}
        {phase === "etapa" && (
          <div className="flex gap-1 mb-6">
            {etapas.map((e, i) => (
              <div
                key={e.id}
                className={cn(
                  "flex-1 h-1 rounded-sm transition-all",
                  i < etapaIndex
                    ? "bg-accent"
                    : i === etapaIndex
                      ? "bg-warning"
                      : "bg-border-soft"
                )}
              />
            ))}
          </div>
        )}

        {/* Context */}
        {(phase === "etapa" || phase === "branch-pick") && (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 mb-5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
              {strings.context}
            </div>
            <p className="text-[15px] leading-relaxed text-on-surface m-0">
              <MarkdownText text={scenario.context.narrative} />
            </p>
            {scenario.context.keyFacts.length > 0 && (
              <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2">
                {scenario.context.keyFacts.map(([label, val]) => (
                  <div
                    key={label}
                    className="rounded-lg bg-secondary/10 p-2.5 text-center"
                  >
                    <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                      {label}
                    </div>
                    <div className="text-sm font-bold text-secondary">
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Statements (collapsible) */}
        {(phase === "etapa" || phase === "branch-pick") &&
          scenario.statements.length > 0 && (
            <div className="mb-5">
              <FinancialStatementTable statements={scenario.statements} />
            </div>
          )}

        {/* Persistent feedback from previous choice */}
        {lastFeedback && (phase === "etapa" || phase === "branch-pick" || phase === "complete") && (
          <div
            className={cn(
              "px-5 py-3.5 rounded-md mb-5 text-sm leading-relaxed border",
              lastFeedback.correct
                ? "bg-green-50 border-green-200 text-green-900"
                : "bg-red-50 border-red-200 text-red-900"
            )}
          >
            <span className="font-semibold">
              {lastFeedback.correct ? strings.correct : strings.canImprove} —{" "}
            </span>
            <MarkdownText text={lastFeedback.feedback} />
          </div>
        )}

        {/* Revisit banner */}
        {phase === "etapa" && currentEtapaChoice && !lastFeedback && (
          <div className="bg-paper border border-dashed border-accent/40 rounded-md px-4 py-2.5 mb-4 text-xs leading-relaxed text-muted">
            {strings.prevAnswer}:{" "}
            <strong className="text-accent">{currentEtapaChoice.label}</strong>{" "}
            {strings.keepOrChange}
          </div>
        )}

        {/* Etapa phase */}
        {phase === "etapa" && currentEtapa && (
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 leading-snug">
              <MarkdownText text={currentEtapa.prompt} />
            </h3>
            <div className="flex flex-col gap-2.5">
              {shuffledChoices.map((ch) => {
                const wasSelected = currentEtapaAnswer?.choiceId === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleEtapaChoice(ch)}
                    className={cn(
                      "rounded-md border p-4 text-left text-[15px] leading-normal cursor-pointer transition-all relative",
                      wasSelected
                        ? "bg-accent-soft border-accent text-ink"
                        : "bg-surface border-border-soft hover:border-accent hover:bg-paper"
                    )}
                  >
                    {wasSelected && (
                      <span className="absolute top-2 right-3 text-[10px] text-accent font-semibold uppercase tracking-wider">
                        {strings.currentAnswer}
                      </span>
                    )}
                    <MarkdownText text={ch.label} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Branch pick */}
        {phase === "branch-pick" && (
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-2">
              {strings.branchPick}
            </div>
            <h3 className="font-heading text-2xl font-semibold mb-2">
              {strings.chooseBranch}
            </h3>
            <p className="text-sm text-muted mb-5">{strings.branchInstructions}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleBranchPick(b)}
                  className="text-left bg-surface border border-border-soft rounded-lg p-5 cursor-pointer transition-all hover:border-accent hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent text-white font-bold text-sm">
                      {b.letter}
                    </span>
                    <span className="text-xs text-muted font-semibold uppercase tracking-wider">
                      {b.shortLabel}
                    </span>
                  </div>
                  <h4 className="font-heading text-base font-semibold mb-2 leading-tight">
                    <MarkdownText text={b.label} />
                  </h4>
                  <p className="text-sm text-muted leading-relaxed">
                    <MarkdownText text={b.description} />
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {phase === "result" && chosenBranch && (
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-2">
              {strings.result}
            </div>
            <h3 className="font-heading text-xl font-semibold mb-1 leading-snug">
              {chosenBranch.resultPanel.headline}
            </h3>
            <p className="text-sm text-muted mb-4">
              Caminho {chosenBranch.letter}: {chosenBranch.label}
            </p>

            {chosenBranch.resultPanel.deltas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                {chosenBranch.resultPanel.deltas.map((d, i) => (
                  <div
                    key={i}
                    className="bg-surface border border-border-soft rounded-md p-4"
                  >
                    <div className="text-[10px] text-muted uppercase tracking-wider mb-1">
                      {d.label}
                    </div>
                    <div
                      className={cn(
                        "text-base font-bold",
                        d.tone === "positive" && "text-success",
                        d.tone === "negative" && "text-danger",
                        d.tone === "neutral" && "text-ink"
                      )}
                    >
                      {d.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-surface border border-border-soft rounded-lg p-5 mb-5 text-[15px] leading-relaxed">
              <MarkdownText text={chosenBranch.resultPanel.commentary} />
            </div>

            <button
              onClick={() => {
                setLastFeedback(null);
                setPhase("reflection");
              }}
              className="bg-accent text-white px-5 py-2.5 rounded-md text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
            >
              Continuar para reflexão →
            </button>
          </div>
        )}

        {/* Reflection */}
        {phase === "reflection" && chosenBranch && (
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-2">
              {strings.reflection}
            </div>
            <h3 className="font-heading text-lg font-semibold mb-4 leading-snug">
              <MarkdownText text={chosenBranch.reflection.prompt} />
            </h3>
            <div className="flex flex-col gap-2.5">
              {shuffledReflection.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => handleReflectionChoice(ch)}
                  className="rounded-md border border-border-soft bg-surface p-4 text-left text-[15px] cursor-pointer transition-all hover:border-accent hover:bg-paper"
                >
                  <MarkdownText text={ch.label} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Complete */}
        {phase === "complete" && chosenBranch && (
          <div className="bg-surface border border-border-soft rounded-lg p-8 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-2">
              {strings.complete}
            </div>
            <h3 className="font-heading text-2xl font-semibold mb-2">
              {scenario.title}
            </h3>
            <p className="text-sm text-muted mb-6">{strings.completeIntro}</p>
            <div className="inline-block">
              <div className="text-[10px] text-muted uppercase tracking-wider mb-2">
                {strings.finalScore}
              </div>
              <div className="num text-4xl font-bold text-accent mb-1">
                {score} / {maxScore}
              </div>
              <div className="text-xs text-muted mb-6">
                Caminho escolhido: {chosenBranch.letter} — {chosenBranch.shortLabel}
              </div>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => {
                  setChosenBranch(null);
                  setReflectionChoice(null);
                  setLastFeedback(null);
                  setPhase("branch-pick");
                }}
                className="bg-surface border border-border-soft text-ink px-5 py-2.5 rounded-md text-sm font-semibold cursor-pointer hover:border-ink transition-colors"
              >
                {strings.tryAnother}
              </button>
              <button
                onClick={handleFinish}
                className="bg-accent text-white px-5 py-2.5 rounded-md text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              >
                {strings.finishReturn}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
