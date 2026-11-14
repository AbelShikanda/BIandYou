"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { useMembers, useProjects } from "@/components/use-biandyou-data";
import { Avatar, EmptyState } from "@/components/states";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const projects = useProjects();
  const members = useMembers();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState title="Project not found" hint="It may have been unpublished." action={<button className="btn-ghost" onClick={() => router.push("/projects")}>Back to gallery</button>} />
      </div>
    );
  }

  const owner = members.find((m) => m.id === project.ownerId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <button onClick={() => router.back()} className="flex min-h-[44px] items-center gap-1.5 text-sm text-muted hover:text-white"><ArrowLeft size={16} aria-hidden /> Back</button>
      {project.status !== "approved" && <span className="chip mt-2 w-fit border-lime/30 text-lime capitalize">{project.status}</span>}
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{project.name}</h1>
      <p className="mt-1 text-base text-muted">{project.tagline}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">{project.tags.map((t) => <span key={t} className="chip border-violet/30 text-violet">{t}</span>)}</div>

      <p className="mt-6 leading-relaxed text-white/90">{project.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.links.github && (
          <a href={project.links.github} target="_blank" rel="noreferrer" className="btn-ghost"><Github size={16} aria-hidden /> Source</a>
        )}
        {project.links.live && (
          <a href={project.links.live} target="_blank" rel="noreferrer" className="btn-primary"><ExternalLink size={16} aria-hidden /> Live site</a>
        )}
      </div>

      {owner && (
        <Link href={`/members/${owner.id}`} className="hairline-card mt-8 flex items-center gap-4 p-5 transition-colors hover:border-cyan/30">
          <Avatar name={owner.name} color={owner.color} size={56} />
          <span>
            <span className="block text-[11px] uppercase tracking-wider text-muted">Built by</span>
            <span className="mt-0.5 block font-display font-semibold text-white">{owner.name}</span>
            <span className="text-xs text-muted">{owner.title}</span>
          </span>
        </Link>
      )}
    </div>
  );
}
