"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ModalContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="relative pointer-events-auto w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-2xl shadow-2xl animate-in zoom-in-95"
          >
            <div className="p-6">
              <div id="modal-content" />
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be inside ModalProvider");
  return ctx;
}

export function ModalContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}

export function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button variant="ghost" size="sm" onClick={onClose}>
        <X size={18} />
      </Button>
    </div>
  );
}