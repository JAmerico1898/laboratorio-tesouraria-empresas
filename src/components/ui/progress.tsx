interface ProgressProps {
  value: number;
  max: number;
  className?: string;
}

export function Progress({ value, max, className = "" }: ProgressProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-border-soft ${className}`}>
      <div
        className="h-full bg-accent transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
