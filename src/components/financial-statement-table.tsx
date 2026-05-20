"use client";

import { useState } from "react";
import type { FinancialStatement, StatementRow } from "@/types/scenario";
import { formatBRNumber, cn } from "@/lib/format";

interface FinancialStatementTableProps {
  statements: FinancialStatement[];
  defaultOpen?: boolean;
}

export function FinancialStatementTable({
  statements,
  defaultOpen = false,
}: FinancialStatementTableProps) {
  const [activeId, setActiveId] = useState<string>(statements[0]?.id ?? "");
  const [open, setOpen] = useState<boolean>(defaultOpen);

  if (statements.length === 0) return null;
  const active = statements.find((s) => s.id === activeId) ?? statements[0];

  return (
    <div className="bg-surface border border-border-soft rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 text-left cursor-pointer hover:bg-paper transition-colors"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Demonstrações financeiras
        </span>
        <span className="text-muted text-sm">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="border-t border-border-soft">
          {statements.length > 1 && (
            <div className="flex gap-1 px-5 pt-4 border-b border-border-soft">
              {statements.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-t-md border-b-2 -mb-px transition-colors cursor-pointer",
                    active.id === s.id
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-ink"
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}

          <div className="p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h4 className="font-heading text-base font-semibold text-ink">
                {active.title}
              </h4>
              <span className="text-xs text-muted">{active.unit}</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-soft">
                  <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider text-muted"></th>
                  {active.periods.map((p) => (
                    <th
                      key={p}
                      className="text-right py-2 pl-4 text-xs font-semibold uppercase tracking-wider text-muted num"
                    >
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {active.sections.map((section, sIdx) => (
                  <SectionBlock
                    key={sIdx}
                    label={section.label}
                    rows={section.rows}
                    periods={active.periods.length}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionBlock({
  label,
  rows,
  periods,
}: {
  label: string;
  rows: StatementRow[];
  periods: number;
}) {
  return (
    <>
      <tr>
        <td
          colSpan={periods + 1}
          className="pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-accent"
        >
          {label}
        </td>
      </tr>
      {rows.map((row, rIdx) => (
        <RowLine key={rIdx} row={row} />
      ))}
    </>
  );
}

function RowLine({ row }: { row: StatementRow }) {
  const indent = row.indent ?? 0;
  const emphasis = row.emphasis;
  const padLeft = ["pl-0", "pl-4", "pl-8"][indent];
  return (
    <tr
      className={cn(
        emphasis === "subtotal" && "border-t border-border-soft font-semibold",
        emphasis === "total" && "border-t-2 border-ink font-bold",
        emphasis === "bold" && "font-semibold"
      )}
    >
      <td className={cn("py-1.5", padLeft)}>{row.label}</td>
      {row.values.map((v, i) => (
        <td key={i} className="py-1.5 pl-4 text-right num">
          {formatBRNumber(v)}
        </td>
      ))}
    </tr>
  );
}
