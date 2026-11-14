import Link from "next/link";
import { ArrowRight, CalendarDays, Rocket, Sparkles, Users } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { members, events, projects } from "@/lib/mock-data";
import { NetworkHero } from "@/components/network-hero";
import { AnimatedNumber } from "@/components/animated-number";
import { Avatar, SectionHeader } from "@/components/states";
import { formatDateTime } from "@/lib/utils";

const heroNodes = [
  { id: "m-sara", label: "Sara Okonkwo — Founder @ Fieldnote", kind: "Member" as const },
  { id: "m-milo", label: "Milo Member — CS Junior", kind: "Member" as const },
  { id: "m-jin", label: "Jin Park — Design Systems", kind: "Member" as const },
  { id: "m-leo", label: "Leo Martins — CTO @ Haulmark", kind: "Member" as const },
  { id: "m-priya", label: "Priya Raman — MBA + MS CS", kind: "Member" as const },
  { id: "m-nina", label: "Nina Volkov — Data Infra", kind: "Member" as const },
  { id: "p-1", label: "Fieldnote — AI scribe", kind: "Project" as const },
  { id: "p-3", label: "graphui — Graph viz primitives", kind: "Project" as const },
  { id: "p-5", label: "Paperplane — Dev tool onboarding", kind: "Project" as const },
  { id: "e-1", label: "Demo Day: Fall Batch", kind: "Event" as const },
  { id: "e-4", label: "Spring Hackathon: Agents Assemble", kind: "Event" as const },
];

export default function LandingPage() {
  const featuredEvents = events.filter((e) => new Date(e.start) > new Date()).slice(0, 3);
  const featuredProjects = projects.filter((p) => p.status === "approved").slice(0, 4);
  const memberCount = 1400 + members.length;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="radial-glow left-[-120px] top-[-120px] h-96 w-96 bg-violet/25" aria-hidden="true" />
        <div className="radial-glow right-[-140px] top-1/4 h-96 w-96 bg-cyan/15" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 pb-16 pt-8 sm:px-6 md:pt-14 lg:grid-cols-2 lg:gap-10">
          <div className="relative z-10 order-2 lg:order-1">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 text-xs font-medium text-cyan">
              <Sparkles size={13} aria-hidden /> Members-only · demo build
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl xl:text-6xl">
              Where startups, students <span className="accent-text">& tech collide.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              {siteConfig.name} is a living network: demo days, hackathons, project collabs and
              ruthless honesty — for everyone building the future.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="btn-primary text-base">
                Request access <ArrowRight size={17} aria-hidden />
              </Link>
              <Link href="/login" className="btn-ghost text-base">
                Member sign in
              </Link>
            </div>
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-hairline pt-6">
              {[
                { v: memberCount, suffix: "+", label: "members" },
                { v: 320, suffix: "+", label: "events hosted" },
                { v: 85, suffix: "+", label: "projects shipped" },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-2xl font-bold text-white sm:text-3xl">
                    <AnimatedNumber value={s.v} suffix={s.suffix} />
                  </dd>
                  <dd className="text-[11px] uppercase tracking-wider text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative order-1 h-[320px] sm:h-[420px] lg:order-2 lg:h-[560px]">
            <NetworkHero nodes={heroNodes} />
            <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.25em] text-muted">
              Hover the nodes · drag to explore
            </p>
          </div>
        </div>
      </section>

      {/* ── Value props ──────────────────────────────────── */}
      <section className="border-t border-hairline bg-surface-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeader eyebrow="Why BIandYou" title="A network that actually compounds" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Rocket, title: "Ship with your people", body: "Find a co-founder, an engineer, a designer — or the three pilot customers you need next sprint." },
              { icon: CalendarDays, title: "Rooms worth showing up to", body: "Demo days, hackathons, founder office hours and reading groups. Every week, on-site and on Discord." },
              { icon: Users, title: "Honest signal, not noise", body: "Members vet each other. Warm intros, teardowns and real feedback — no lukewarm coffee-chats." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="hairline-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-cyan/30">
                <Icon size={22} className="text-cyan" aria-hidden />
                <h3 className="mt-3 font-display text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured events ──────────────────────────────── */}
      <section className="relative border-t border-hairline">
        <div className="radial-glow right-0 top-0 h-72 w-72 bg-violet/15" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeader eyebrow="Upcoming" title="What's next at the hub" action={<Link href="/events" className="text-sm text-cyan hover:underline">All events →</Link>} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((e) => (
              <li key={e.id} className="gradient-card p-5">
                <span className="chip border-violet/30 text-violet">{e.category}</span>
                <h3 className="mt-3 font-display font-semibold leading-snug text-white">{e.title}</h3>
                <p className="mt-2 text-xs text-muted">{formatDateTime(e.start)}</p>
                <p className="mt-1 text-xs text-muted">{e.location}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Featured projects ────────────────────────────── */}
      <section className="border-t border-hairline bg-surface-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeader eyebrow="Built by members" title="Projects shipping right now" action={<Link href="/projects" className="text-sm text-cyan hover:underline">View all projects →</Link>} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((p) => {
              const owner = members.find((m) => m.id === p.ownerId);
              return (
                <li key={p.id} className="hairline-card flex flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan/30">
                  <div className="h-1.5 w-12 rounded-full" style={{ background: p.color }} aria-hidden="true" />
                  <h3 className="mt-3 font-display font-semibold text-white">{p.name}</h3>
                  <p className="mt-1 text-xs leading-snug text-muted">{p.tagline}</p>
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    {owner && <Avatar name={owner.name} color={owner.color} size={22} />}
                    <p className="text-xs text-muted">{owner?.name}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">
            The network is <span className="accent-text">one commit away.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">Join 1,400+ builders. Demo mode — every button works, nothing leaves your browser.</p>
          <Link href="/signup" className="btn-primary mt-6 text-base">
            Join {siteConfig.name} <ArrowRight size={17} aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
