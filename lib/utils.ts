import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function relativeDate(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = d.getTime() - now;
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  const hours = Math.round(abs / 3600000);
  const days = Math.round(abs / 86400000);
  const fmt = () =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (abs < 3600000) return diff >= 0 ? `in ${mins}m` : `${mins}m ago`;
  if (abs < 86400000) return diff >= 0 ? `in ${hours}h` : `${hours}h ago`;
  if (days < 30) return diff >= 0 ? `in ${days}d` : `${days}d ago`;
  return fmt();
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function googleCalendarUrl(opts: {
  title: string;
  startIso: string;
  endIso: string;
  details?: string;
  location?: string;
}): string {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(opts.startIso)}/${fmt(opts.endIso)}`,
    details: opts.details ?? "",
    location: opts.location ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
