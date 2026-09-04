"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-text",
          "placeholder:text-muted",
          "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Select.displayName = "Select";
