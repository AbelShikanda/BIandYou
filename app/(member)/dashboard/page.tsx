"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, MessageSquare, Pin, Sparkles, Rocket } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Avatar, CardSkeleton, SectionHeader } from "@/components/states";
import { useDiscussions, useEvents, useMembers, useProjects } from "@/components/use-biandyou-data";
import { formatDateTime, relativeDate } from "@/lib/utils";

export default function DashboardPage() {
  const { session } = useAuth();
  const events = useEvents();
  const discussions = useDiscussions();
  const members = useMembers();
  const projects = useProjects();

  const now = Date.now();
  const upcoming = events
    .filter((e) => e.published && new Date(e.start).getTime() > now)
    .sort((a, b) => +new Date(a.start) - +new Date(b.start))
    .slice(0, 3);
  const recent = [...discussions].sort((a, b) => +new Date(b.lastActivityAt) - +new Date(a.lastActivityAt)).slice(0, 4);
  const newcomers = [...members].filter((m) => !m.banned).sort((a, b) => +new Date(b.joinedAt) - +new Date(a.joinedAt)).slice(0, 4);
  const mine = projects.filter((p) => p.ownerId === session?.userId);

  const memberName = (id: string) => members.find((m) => m.id === id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">Dashboard</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Hey {session?.name.split(" ")[0]},
          </h1>
          <p className="mt-1 text-sm text-muted">Here&apos;s what&apos;s moving in the network.</p>
        </div>
        <Link href="/events" className="btn-ghost text-xs">Browse all events <ArrowRight size={13} /></Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Upcoming events */}
        <section aria-labelledby="dash-events">
          <SectionHeader eyebrow="Next up" title="Upcoming events" />
          <ul className="space-y-3">
            {upcoming.length === 0 && <li className="text-sm text-muted">No upcoming events yet.</li>}
            {upcoming.map((e) => (
              <li key={e.id}>
                <Link href={`/events/${e.id}`} className="hairline-card block p-4 transition-all hover:-translate-y-0.5 hover:border-cyan/30">
                  <span className="chip border-violet/30 text-violet">{e.category}</span>
                  <h3 className="mt-2 text-sm font-semibold leading-snug text-white">{e.title}</h3>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted"><CalendarDays size={12} aria-hidden /> {formatDateTime(e.start)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent discussions */}
        <section aria-labelledby="dash-discussions">
          <SectionHeader eyebrow="Fresh signal" title="Recent discussions" />
          <ul className="space-y-3">
            {recent.map((t) => {
              const author = memberName(t.authorId);
              return (
                <li key={t.id}>
                  <Link href={`/discussions/${t.id}`} className="hairline-card block p-4 transition-all hover:-translate-y-0.5 hover:border-cyan/30">
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold leading-snug text-white">{t.pinned && <Pin size={12} className="shrink-0 text-lime" aria-label="Pinned" />}{t.title}</h3>
                    <p className="mt-1.5 flex items-center gap-2 text-xs text-muted">
                      <MessageSquare size={12} aria-hidden /> {t.replies.length} replies · {relativeDate(t.lastActivityAt)} · {author?.name.split(" ")[0]}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* New members + my projects */}
        <div className="space-y-6">
          <section aria-labelledby="dash-members">
            <SectionHeader eyebrow="Say hi" title="New members" />
            <ul className="hairline-card divide-y divide-hairline">
              {newcomers.map((m) => (
                <li key={m.id}>
                  <Link href={`/members/${m.id}`} className="flex min-h-[56px] items-center gap-3 px-4 py-2 transition-colors hover:bg-white/5">
                    <Avatar name={m.name} color={m.color} size={34} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-white">{m.name}</span>
                      <span className="block truncate text-[11px] text-muted">{m.title}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="dash-projects">
            <SectionHeader eyebrow="Yours" title="Your projects" />
            {mine.length === 0 ? (
              <p className="hairline-card px-4 py-5 text-sm text-muted">
                Nothing yet. <Link href="/projects" className="text-cyan hover:underline">Submit your first project →</Link>
              </p>
            ) : (
              <ul className="space-y-2">
                {mine.map((p) => (
                  <li key={p.id}>
                    <Link href={`/projects/${p.id}`} className="hairline-card flex items-center gap-3 px-4 py-3 hover:border-cyan/30">
                      <Rocket size={16} className="shrink-0 text-violet" aria-hidden />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-white">{p.name}</span>
                        <span className="block text-[11px] text-muted capitalize">{p.status} approval</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {events.length === 0 && <div className="mt-6"><CardSkeleton /></div>}
      <p className="mt-8 flex items-center gap-1.5 text-[11px] text-muted"><Sparkles size={12} className="text-lime" aria-hidden /> Feed refreshes live from localStorage demo data.</p>
    </div>
  );
}
