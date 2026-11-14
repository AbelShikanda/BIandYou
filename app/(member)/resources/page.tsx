"use client";

import { useState } from "react";
import { BookOpen, ExternalLink, Wrench, GraduationCap, HeartHandshake, UsersRound, FileText } from "lucide-react";
import { useResources } from "@/components/use-biandyou-data";
import { EmptyState, SectionHeader } from "@/components/states";
import type { ResourceCategory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const cats: { value: ResourceCategory | "all"; label: string; icon: typeof Wrench }[] = [
  { value: "all", label: "All", icon: BookOpen },
  { value: "guides", label: "Guides", icon: BookOpen },
  { value: "tools", label: "Tools", icon: Wrench },
  { value: "templates", label: "Templates", icon: FileText },
  { value: "funding", label: "Funding", icon: HeartHandshake },
  { value: "hiring", label: "Hiring", icon: UsersRound },
  { value: "learning", label: "Learning", icon: GraduationCap },
];

export default function ResourcesPage() {
  const resources = useResources();
  const [cat, setCat] = useState<ResourceCategory | "all">("all");
  const filtered = resources.filter((r) => cat === "all" || r.category === cat);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeader eyebrow="Vault" title="Resources" />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {cats.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setCat(value)}
            aria-pressed={cat === value}
            className={cn(
              "flex min-h-[40px] items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors",
              cat === value ? "border-cyan/60 bg-cyan/10 text-cyan" : "border-hairline bg-surface-800 text-muted hover:text-white"
            )}
          >
            <Icon size={13} aria-hidden /> {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6"><EmptyState title="Nothing in this category yet" hint="Admins curate the vault — check back soon." /></div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <li key={r.id}>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="hairline-card flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan/30"
              >
                <span className="chip w-fit capitalize text-violet border-violet/30">{r.category}</span>
                <h2 className="mt-3 font-display font-semibold leading-snug text-white">{r.title}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{r.description}</p>
                <span className="mt-auto flex items-center justify-between pt-4 text-[11px] text-muted">
                  <span>Added by {r.addedBy}</span>
                  <ExternalLink size={13} className="text-cyan" aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
