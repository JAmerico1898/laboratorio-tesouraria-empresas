export function formatBRNumber(value: number | null, fractionDigits = 0): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatBRCurrency(value: number | null, fractionDigits = 0): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `R$ ${formatBRNumber(value, fractionDigits)}`;
}

export function formatPercent(value: number | null, fractionDigits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
