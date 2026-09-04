import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDate(d: string | Date) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(d));
}
export function parseTags(raw: string): string[] {
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v : []; } catch { return []; }
}
export function stringifyTags(tags: string[]): string { return JSON.stringify(tags); }
