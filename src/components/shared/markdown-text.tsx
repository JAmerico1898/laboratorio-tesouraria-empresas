interface MarkdownTextProps {
  text: string;
  className?: string;
}

export function MarkdownText({ text, className }: MarkdownTextProps) {
  const lines = text.split(/\n/);
  return (
    <span className={className}>
      {lines.map((line, lineIdx) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={lineIdx}>
            {parts.map((p, i) =>
              p.startsWith("**") && p.endsWith("**") ? (
                <strong key={i} className="font-semibold text-ink">
                  {p.slice(2, -2)}
                </strong>
              ) : (
                <span key={i}>{p}</span>
              )
            )}
            {lineIdx < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}
