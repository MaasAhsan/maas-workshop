"use client";
import React, { createContext, useCallback, useContext, useState } from "react";

type Toast = { id: number; message: string; type: "success" | "error" | "info" };
type ToastType = Toast["type"];

const ToastContext = createContext<{ toast: (msg: string, type?: ToastType) => void } | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl text-sm font-medium shadow-lg border backdrop-blur-md animate-in slide-in-from-bottom-2 ${
              t.type === "success"
                ? "bg-green-950/90 border-green-800 text-green-100"
                : t.type === "error"
                  ? "bg-red-950/90 border-red-800 text-red-100"
                  : "bg-surface border-border text-text"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
