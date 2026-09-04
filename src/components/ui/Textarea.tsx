"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1.5">{label}</label>
      )}
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-muted resize-y min-h-[100px]",
          "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-destructive focus:ring-destructive focus:border-destructive",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? "textarea-error" : undefined}
        {...props}
      />
      {error && (
        <p id="textarea-error" className="mt-1.5 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
);
Textarea.displayName = "Textarea";
