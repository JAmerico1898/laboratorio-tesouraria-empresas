export type Choice = {
  id: string;
  label: string;
  correct: boolean;
  score: number;
  feedback: string;
};

export type Etapa = {
  id: string;
  prompt: string;
  choices: Choice[];
};

export type StatementRow = {
  label: string;
  values: (number | null)[];
  emphasis?: "bold" | "subtotal" | "total";
  indent?: 0 | 1 | 2;
};

export type StatementSection = {
  label: string;
  rows: StatementRow[];
};

export type FinancialStatement = {
  id: string;
  title: string;
  unit: string;
  periods: string[];
  sections: StatementSection[];
};

export type Delta = {
  label: string;
  value: string;
  tone: "positive" | "negative" | "neutral";
};

export type Branch = {
  id: string;
  letter: "A" | "B" | "C";
  label: string;
  shortLabel: string;
  description: string;
  resultPanel: {
    headline: string;
    deltas: Delta[];
    commentary: string;
  };
  reflection: {
    prompt: string;
    choices: Choice[];
  };
};

export type Scenario = {
  id: string;
  code: string;
  title: string;
  company: string;
  difficulty: "Fácil" | "Intermediário" | "Avançado";
  estimatedMinutes: number;
  context: {
    narrative: string;
    keyFacts: [string, string][];
  };
  statements: FinancialStatement[];
  etapas: Etapa[];
  branches: Branch[];
};

export type CompletedScenario = {
  simId: string;
  score: number;
  maxScore: number;
  branchChosen: "A" | "B" | "C";
  completedAt: string;
};
