"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { useEvents } from "@/components/use-biandyou-data";
import { EmptyState, SectionHeader } from "@/components/states";
import { formatDateTime, cn } from "@/lib/utils";
import type { EventCategory } from "@/lib/mock-data";

const categories: (EventCategory | "all")[] = ["all", "workshop", "talk", "demo-day", "social", "hackathon", "office-hours"];

export default function EventsPage() {
  const events = useEvents();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [category, setCategory] = useState<EventCategory | "all">("all");

  const now = Date.now();
  const filtered = events
    .filter((e) => e.published)
    .filter((e) => (tab === "upcoming" ? +new Date(e.start) >= now : +new Date(e.start) < now))
    .filter((e) => category === "all" || e.category === category)
    .sort((a, b) => (tab === "upcoming" ? +new Date(a.start) - +new Date(b.start) : +new Date(b.start) - +new Date(a.start)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeader eyebrow="Calendar" title="Events" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg border border-hairline bg-surface-800 p-1" role="tablist" aria-label="Time filter">
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "min-h-[40px] rounded-md px-4 text-sm font-medium capitalize transition-colors",
                tab === t ? "bg-cyan text-black" : "text-muted hover:text-white"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted">
          <span className="sr-only">Filter by category</span>
          <select
            className="input w-auto min-h-[40px] text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value as EventCategory | "all")}
            aria-label="Filter by category"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Nothing here yet" hint="No events match that filter. Try another category or tab." />
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <li key={e.id}>
              <Link href={`/events/${e.id}`} className="hairline-card flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan/30">
                <span className="chip w-fit border-violet/30 text-violet">{e.category}</span>
                <h2 className="mt-3 font-display font-semibold leading-snug text-white">{e.title}</h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><CalendarDays size={12} aria-hidden />{formatDateTime(e.start)}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted"><MapPin size={12} aria-hidden />{e.location}</p>
                <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-muted"><Users size={12} aria-hidden />{e.attendees.length} going</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
