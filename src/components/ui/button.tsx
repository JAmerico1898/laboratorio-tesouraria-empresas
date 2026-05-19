import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-white border-accent hover:opacity-90",
  outline:
    "bg-surface text-ink border-border-soft hover:border-accent hover:text-accent",
  ghost:
    "bg-transparent text-ink border-transparent hover:bg-accent-soft hover:text-accent",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    />
  );
}
