"use client";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & { hover?: boolean };

export function Card({ className, hover, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-xl p-5",
        hover && "hover:bg-surface-hover transition-colors cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
