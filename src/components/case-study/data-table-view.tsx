import type { DataTable, CellValue } from "@/data/case-studies-data";

function formatCell(v: CellValue): string {
  if (v === null) return "";
  if (typeof v === "number") {
    return v.toLocaleString("pt-BR", {
      minimumFractionDigits: Number.isInteger(v) ? 0 : 1,
      maximumFractionDigits: 2,
    });
  }
  return String(v);
}

const emphasisClass: Record<string, string> = {
  bold: "font-bold text-on-surface",
  subtotal: "font-semibold text-on-surface border-t border-outline-variant/60",
  total: "font-bold text-on-surface border-t-2 border-primary bg-primary/5",
  muted: "text-on-surface-variant italic text-[12px]",
};

const indentPx: Record<number, string> = {
  0: "",
  1: "pl-4",
  2: "pl-8",
};

export function DataTableView({ table }: { table: DataTable }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden mb-6">
      <div className="px-5 py-3 border-b border-outline-variant bg-surface-container-low">
        <div className="text-xs font-bold uppercase tracking-wider text-secondary">
          {table.title}
        </div>
        {table.subtitle && (
          <div className="text-[11px] text-on-surface-variant mt-1 italic">
            {table.subtitle}
          </div>
        )}
        {table.unit && (
          <div className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">
            Unidade: {table.unit}
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="text-left px-4 py-2 font-semibold text-on-surface-variant uppercase tracking-wider text-[10px]">
                {/* row label column */}
              </th>
              {table.columns.map((c, i) => (
                <th
                  key={i}
                  className="text-right px-4 py-2 font-semibold text-on-surface-variant uppercase tracking-wider text-[10px] whitespace-nowrap"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => {
              const emp = row.emphasis ? emphasisClass[row.emphasis] : "";
              const ind = indentPx[row.indent ?? 0];
              return (
                <tr key={i} className={emp}>
                  <td className={`px-4 py-1.5 text-left ${ind}`}>
                    {row.label}
                  </td>
                  {row.values.map((v, j) => (
                    <td
                      key={j}
                      className="px-4 py-1.5 text-right whitespace-nowrap"
                    >
                      {formatCell(v)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
