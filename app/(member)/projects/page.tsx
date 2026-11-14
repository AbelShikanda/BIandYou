"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useMembers, useProjects } from "@/components/use-biandyou-data";
import { projectsRepo } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/toast";
import { Avatar, EmptyState, SectionHeader } from "@/components/states";

export default function ProjectsPage() {
  const { session } = useAuth();
  const projects = useProjects();
  const members = useMembers();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();
  const visible = projects.filter((p) => p.status === "approved");
  const filtered = visible.filter((p) => {
    if (tag !== "all" && !p.tags.includes(tag)) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [p.name, p.tagline, p.description, ...p.tags].join(" ").toLowerCase().includes(q);
  });

  const ownerName = (id: string) => members.find((m) => m.id === id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    projectsRepo.create({
      name: name.trim(),
      tagline: tagline.trim(),
      description: desc.trim(),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 6),
      ownerId: session.userId,
      links: {},
    });
    setName(""); setTagline(""); setDesc(""); setTags("");
    setShowForm(false);
    toast("Project submitted — pending admin approval.", "success");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeader
        eyebrow="Gallery"
        title="Member projects"
        action={
          <button className="btn-primary text-xs" onClick={() => setShowForm((v) => !v)} aria-expanded={showForm}>
            <Plus size={14} aria-hidden /> Submit project
          </button>
        }
      />

      {showForm && (
        <form onSubmit={submit} className="hairline-card mb-6 grid gap-3 p-5 sm:grid-cols-2">
          <div><label htmlFor="p-name" className="label">Name</label><input id="p-name" required className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label htmlFor="p-tagline" className="label">Tagline</label><input id="p-tagline" required className="input" value={tagline} onChange={(e) => setTagline(e.target.value)} /></div>
          <div className="sm:col-span-2"><label htmlFor="p-desc" className="label">Description</label><textarea id="p-desc" required rows={3} className="input" value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          <div><label htmlFor="p-tags" className="label">Tags (comma separated)</label><input id="p-tags" className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ai, rust, saas" /></div>
          <div className="flex items-end"><button type="submit" className="btn-primary w-full">Submit for review</button></div>
        </form>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <span className="sr-only">Search projects</span>
          <input className="input pl-9" placeholder="Search projects…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search projects" />
        </label>
        <select className="input w-auto" value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Filter by tag">
          <option value="all">All tags</option>
          {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6"><EmptyState title="No projects found" hint="Try a different search or tag." /></div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => {
            const owner = ownerName(p.ownerId);
            return (
              <li key={p.id}>
                <Link href={`/projects/${p.id}`} className="hairline-card flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan/30">
                  <div className="h-1.5 w-12 rounded-full" style={{ background: p.color }} aria-hidden="true" />
                  <h2 className="mt-3 font-display font-semibold text-white">{p.name}</h2>
                  <p className="mt-1 text-xs leading-snug text-muted">{p.tagline}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    {owner && <Avatar name={owner.name} color={owner.color} size={22} />}
                    <p className="text-xs text-muted">{owner?.name}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
