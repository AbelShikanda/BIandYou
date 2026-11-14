"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { useMembers } from "@/components/use-biandyou-data";
import { Avatar, EmptyState, SectionHeader } from "@/components/states";
import type { MemberKind } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const kinds: (MemberKind | "all")[] = ["all", "startup", "student", "tech"];

export default function MembersPage() {
  const members = useMembers();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<MemberKind | "all">("all");
  const [skill, setSkill] = useState<string>("all");

  const allSkills = useMemo(() => Array.from(new Set(members.flatMap((m) => m.skills))).sort(), [members]);

  const filtered = members
    .filter((m) => !m.banned)
    .filter((m) => kind === "all" || m.kind === kind)
    .filter((m) => skill === "all" || m.skills.includes(skill))
    .filter((m) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return [m.name, m.handle, m.title, ...m.skills].join(" ").toLowerCase().includes(q);
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeader eyebrow="Directory" title="Members" />
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <span className="sr-only">Search members</span>
          <input
            className="input pl-9"
            placeholder="Search name, skill, title…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search members"
          />
        </label>
        <div className="inline-flex rounded-lg border border-hairline bg-surface-800 p-1" role="group" aria-label="Filter by kind">
          {kinds.map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={cn(
                "min-h-[40px] rounded-md px-3 text-xs font-medium capitalize transition-colors",
                kind === k ? "bg-cyan text-black" : "text-muted hover:text-white"
              )}
            >
              {k}
            </button>
          ))}
        </div>
        <select className="input w-auto" value={skill} onChange={(e) => setSkill(e.target.value)} aria-label="Filter by skill">
          <option value="all">All skills</option>
          {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6"><EmptyState icon={Users} title="No members match" hint="Try clearing the search or filters." /></div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => (
            <li key={m.id}>
              <Link href={`/members/${m.id}`} className="hairline-card flex h-full flex-col items-center p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-cyan/30">
                <Avatar name={m.name} color={m.color} size={64} />
                <h2 className="mt-3 font-display font-semibold text-white">{m.name}</h2>
                <p className="mt-0.5 text-xs text-muted">@{m.handle} · {m.kind}</p>
                <p className="mt-1.5 text-xs leading-snug text-muted">{m.title}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-1">
                  {m.skills.slice(0, 3).map((s) => <span key={s} className="chip">{s}</span>)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
