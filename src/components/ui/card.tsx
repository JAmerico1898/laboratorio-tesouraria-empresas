import type { HTMLAttributes } from "react";
import { cn } from "@/lib/format";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "bg-surface border border-border-soft rounded-lg",
        className
      )}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("p-5 border-b border-border-soft", className)} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("p-5", className)} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("p-5 border-t border-border-soft bg-paper/50", className)}
    />
  );
}
