import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSi(value: number, unit: string, digits = 2): string {
  if (!Number.isFinite(value)) return `— ${unit}`;
  const abs = Math.abs(value);
  if (abs === 0) return `0 ${unit}`;
  const prefixes: [number, string][] = [
    [1e12, "T"],
    [1e9, "G"],
    [1e6, "M"],
    [1e3, "k"],
    [1, ""],
    [1e-3, "m"],
    [1e-6, "µ"],
    [1e-9, "n"],
    [1e-12, "p"],
  ];
  for (const [scale, prefix] of prefixes) {
    if (abs >= scale) {
      const n = value / scale;
      const d = Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 10 ? 1 : digits;
      return `${n.toFixed(d)} ${prefix}${unit}`;
    }
  }
  return `${value.toExponential(2)} ${unit}`;
}

export function formatMm(metres: number): string {
  const mm = Math.max(0, metres * 1000);
  if (mm < 0.05) return "0 mm";
  if (mm >= 1000) return `${(mm / 1000).toFixed(mm % 1000 === 0 ? 0 : 2)} m`;
  if (mm >= 10) return `${mm >= 100 ? mm.toFixed(0) : mm.toFixed(1)} mm`;
  return `${mm.toFixed(1)} mm`;
}
