"use client";

import Link from "next/link";
import { ArrowRight, Ban, CalendarPlus, ClipboardCheck, MessagesSquare, Rocket, Users } from "lucide-react";
import { useDiscussions, useEvents, useMembers, useProjects, useResources } from "@/components/use-biandyou-data";
import { SectionHeader } from "@/components/states";
import { AdminNav } from "@/components/admin-nav";
import { relativeDate } from "@/lib/utils";

export default function AdminOverviewPage() {
  const members = useMembers();
  const events = useEvents();
  const projects = useProjects();
  const discussions = useDiscussions();
  const resources = useResources();

  const pendingProjects = projects.filter((p) => p.status === "pending");
  const flaggedReplies = discussions.reduce((acc, t) => acc + t.replies.filter((r) => r.flagged).length, 0);
  const reportedThreads = discussions.filter((t) => t.reported);
  const pendingItems = pendingProjects.length + flaggedReplies + reportedThreads.length;
  const activeMembers = members.filter((m) => !m.banned);
  const banned = members.filter((m) => m.banned);

  const stats = [
    { label: "Members", value: activeMembers.length, sub: `${banned.length} banned`, icon: Users, href: "/admin/members" },
    { label: "Events", value: events.length, sub: `${events.filter((e) => e.published).length} published`, icon: CalendarPlus, href: "/admin/events" },
    { label: "Projects", value: projects.length, sub: `${pendingProjects.length} awaiting approval`, icon: Rocket, href: "/admin/projects" },
    { label: "Threads", value: discussions.length, sub: `${reportedThreads.length} reported`, icon: MessagesSquare, href: "/admin/discussions" },
  ];

  const activity = [
    ...members.slice(-3).map((m) => ({ id: `m-${m.id}`, text: `${m.name} joined the hub`, at: m.joinedAt, href: `/members/${m.id}` })),
    ...projects.filter((p) => p.status === "pending").map((p) => ({ id: `p-${p.id}`, text: `${p.name} submitted for review`, at: p.createdAt, href: "/admin/projects" })),
    ...discussions.filter((t) => t.reported).map((t) => ({ id: `t-${t.id}`, text: `Thread reported: ${t.title}`, at: t.lastActivityAt, href: "/admin/discussions" })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <AdminNav />
      <SectionHeader eyebrow="Admin" title="Overview" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon, href }) => (
          <Link key={label} href={href} className="hairline-card p-4 transition-all hover:-translate-y-0.5 hover:border-lime/30">
            <Icon size={17} className="text-lime" aria-hidden />
            <p className="mt-2 font-display text-2xl font-bold text-white">{value}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white">{label}</p>
            <p className="mt-0.5 text-[10px] text-muted">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="hairline-card p-5 lg:col-span-3" aria-labelledby="activity-h">
          <h2 id="activity-h" className="text-[11px] font-semibold uppercase tracking-wider text-muted">Recent activity</h2>
          <ul className="mt-3 divide-y divide-hairline">
            {activity.length === 0 && <li className="py-4 text-sm text-muted">All quiet. Nothing needs attention.</li>}
            {activity.map((a) => (
              <li key={a.id}>
                <Link href={a.href} className="flex min-h-[44px] items-center justify-between gap-3 py-2.5 text-sm text-muted hover:text-white">
                  <span className="truncate">{a.text}</span>
                  <span className="shrink-0 text-[11px]">{relativeDate(a.at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="hairline-card p-5 lg:col-span-2" aria-labelledby="qa-h">
          <h2 id="qa-h" className="text-[11px] font-semibold uppercase tracking-wider text-muted">Quick actions</h2>
          <ul className="mt-3 space-y-2">
            {[
              { href: "/admin/projects", label: `Review ${pendingProjects.length} pending project${pendingProjects.length === 1 ? "" : "s"}`, icon: ClipboardCheck },
              { href: "/admin/discussions", label: `Moderate ${flaggedReplies + reportedThreads.length} flagged item${flaggedReplies + reportedThreads.length === 1 ? "" : "s"}`, icon: MessagesSquare },
              { href: "/admin/events", label: "Create or edit events", icon: CalendarPlus },
              { href: "/admin/members", label: `Manage ${members.length} member${members.length === 1 ? "" : "s"}`, icon: Users },
              { href: "/admin/resources", label: `Maintain ${resources.length} resource${resources.length === 1 ? "" : "s"}`, icon: Rocket },
            ].map(({ href, label, icon: Icon }) => (
              <li key={href + label}>
                <Link href={href} className="flex min-h-[44px] items-center gap-2 rounded-lg border border-hairline bg-surface-900 px-3 text-sm text-muted transition-colors hover:border-lime/30 hover:text-white">
                  <Icon size={14} className="shrink-0 text-lime" aria-hidden />
                  <span className="flex-1 truncate">{label}</span>
                  <ArrowRight size={13} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-lime/20 bg-lime/5 px-4 py-3 text-[11px] leading-relaxed text-lime/80">
            <Ban size={12} className="mr-1 inline" aria-hidden /> All admin actions persist to localStorage and apply instantly to member views.
          </div>
        </section>
      </div>
    </div>
  );
}
