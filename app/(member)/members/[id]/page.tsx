"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Github, Globe, Linkedin, Twitter } from "lucide-react";
import { useMembers, useProjects } from "@/components/use-biandyou-data";
import { Avatar, EmptyState, SectionHeader } from "@/components/states";
import { relativeDate } from "@/lib/utils";

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const members = useMembers();
  const projects = useProjects();
  const member = members.find((m) => m.id === id);

  if (!member || member.banned) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState title="Member not found" hint="This profile doesn't exist or the account was removed." action={<button className="btn-ghost" onClick={() => router.push("/members")}>Back to directory</button>} />
      </div>
    );
  }

  const memberProjects = projects.filter((p) => p.ownerId === member.id && p.status === "approved");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <button onClick={() => router.back()} className="flex min-h-[44px] items-center gap-1.5 text-sm text-muted hover:text-white"><ArrowLeft size={16} aria-hidden /> Back</button>

      <div className="hairline-card mt-2 flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <Avatar name={member.name} color={member.color} size={88} />
        <div className="min-w-0">
          <span className="chip border-cyan/30 text-cyan capitalize">{member.kind}</span>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">{member.name}</h1>
          <p className="mt-0.5 text-sm text-muted">@{member.handle} · {member.title}</p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">Member since {relativeDate(member.joinedAt)}</p>
          <div className="mt-3 flex gap-2">
            {member.links.github && <a href={member.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-lg border border-hairline p-2 text-muted hover:text-cyan"><Github size={17} /></a>}
            {member.links.x && <a href={member.links.x} target="_blank" rel="noreferrer" aria-label="X" className="rounded-lg border border-hairline p-2 text-muted hover:text-cyan"><Twitter size={17} /></a>}
            {member.links.linkedin && <a href={member.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-lg border border-hairline p-2 text-muted hover:text-cyan"><Linkedin size={17} /></a>}
            {member.links.website && <a href={member.links.website} target="_blank" rel="noreferrer" aria-label="Website" className="rounded-lg border border-hairline p-2 text-muted hover:text-cyan"><Globe size={17} /></a>}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <section className="hairline-card p-5 md:col-span-2" aria-labelledby="bio-h">
          <h2 id="bio-h" className="text-[11px] font-semibold uppercase tracking-wider text-muted">Bio</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/90">{member.bio}</p>
          <h2 className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted">Skills</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {member.skills.length ? member.skills.map((s) => <span key={s} className="chip border-violet/30 text-violet">{s}</span>) : <span className="text-xs text-muted">No skills listed yet.</span>}
          </div>
        </section>
        <section aria-labelledby="proj-h">
          <h2 id="proj-h" className="text-[11px] font-semibold uppercase tracking-wider text-muted">Projects</h2>
          <ul className="mt-2 space-y-2">
            {memberProjects.map((p) => (
              <li key={p.id}>
                <Link href={`/projects/${p.id}`} className="hairline-card block p-3 transition-colors hover:border-cyan/30">
                  <span className="text-sm font-medium text-white">{p.name}</span>
                  <span className="mt-0.5 block text-[11px] text-muted">{p.tagline}</span>
                </Link>
              </li>
            ))}
            {memberProjects.length === 0 && <li className="text-xs text-muted">No published projects yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
