"use client";

import { useState } from "react";
import { Check, Pencil, Rocket, Trash2, X, CheckCircle2, XCircle } from "lucide-react";
import { useMembers, useProjects } from "@/components/use-biandyou-data";
import { projectsRepo } from "@/lib/data";
import { useToast } from "@/components/toast";
import { AdminNav } from "@/components/admin-nav";
import { Avatar, EmptyState, SectionHeader } from "@/components/states";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { relativeDate, cn } from "@/lib/utils";
import type { Project } from "@/lib/mock-data";

export default function AdminProjectsPage() {
  const projects = useProjects();
  const members = useMembers();
  const toast = useToast();
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ name: "", tagline: "", description: "", tags: "" });
  const [deleting, setDeleting] = useState<Project | null>(null);

  const owner = (id: string) => members.find((m) => m.id === id);
  const filtered = projects.filter((p) => filter === "all" || p.status === filter);

  const startEdit = (p: Project) => {
    setEditing(p);
    setForm({ name: p.name, tagline: p.tagline, description: p.description, tags: p.tags.join(", ") });
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    projectsRepo.update(editing.id, {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 8),
    });
    setEditing(null);
    toast("Project updated.", "success");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <AdminNav />
      <SectionHeader eyebrow="Admin" title="Projects & moderation" />

      <div className="inline-flex rounded-lg border border-hairline bg-surface-800 p-1" role="tablist" aria-label="Status filter">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "min-h-[40px] rounded-md px-4 text-xs font-medium capitalize transition-colors",
              filter === f ? "bg-lime text-black" : "text-muted hover:text-white"
            )}
          >
            {f} ({projects.filter((p) => f === "all" || p.status === f).length})
          </button>
        ))}
      </div>

      {editing && (
        <form onSubmit={saveEdit} className="hairline-card mt-4 grid gap-3 p-5 sm:grid-cols-2">
          <div className="flex items-center justify-between sm:col-span-2">
            <h2 className="font-display font-semibold">Edit {editing.name}</h2>
            <button type="button" onClick={() => setEditing(null)} aria-label="Close editor" className="rounded-lg p-2 text-muted hover:text-white"><X size={18} /></button>
          </div>
          <div><label htmlFor="e-name" className="label">Name</label><input id="e-name" required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label htmlFor="e-tag" className="label">Tagline</label><input id="e-tag" required className="input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
          <div className="sm:col-span-2"><label htmlFor="e-desc" className="label">Description</label><textarea id="e-desc" required rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="sm:col-span-2"><label htmlFor="e-tags" className="label">Tags</label><input id="e-tags" className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
          <button type="submit" className="btn-primary sm:col-span-2"><Check size={16} aria-hidden /> Save project</button>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="mt-6"><EmptyState icon={Rocket} title="Nothing here" hint="No projects in this filter." /></div>
      ) : (
        <ul className="mt-4 space-y-2">
          {filtered.map((p) => {
            const o = owner(p.ownerId);
            return (
              <li key={p.id} className="hairline-card flex flex-wrap items-center gap-3 p-4">
                {o && <Avatar name={o.name} color={o.color} size={40} />}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">
                    {p.name}
                    <span className={cn("chip ml-2 capitalize", p.status === "approved" ? "border-lime/30 text-lime" : p.status === "pending" ? "border-cyan/30 text-cyan" : "border-red-500/30 text-red-400")}>{p.status}</span>
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted">{o?.name} · {p.tagline} · {relativeDate(p.createdAt)}</p>
                </div>
                <div className="flex gap-1.5">
                  {p.status !== "approved" && (
                    <button onClick={() => { projectsRepo.update(p.id, { status: "approved" }); toast(`${p.name} approved.`, "success"); }} title="Approve" aria-label={`Approve ${p.name}`} className="rounded-lg border border-hairline p-2 text-muted hover:border-lime/40 hover:text-lime"><CheckCircle2 size={17} /></button>
                  )}
                  {p.status !== "rejected" && (
                    <button onClick={() => { projectsRepo.update(p.id, { status: "rejected" }); toast(`${p.name} rejected.`, "info"); }} title="Reject" aria-label={`Reject ${p.name}`} className="rounded-lg border border-hairline p-2 text-muted hover:border-red-500/40 hover:text-red-400"><XCircle size={17} /></button>
                  )}
                  <button onClick={() => startEdit(p)} aria-label={`Edit ${p.name}`} className="rounded-lg border border-hairline p-2 text-muted hover:text-cyan"><Pencil size={16} /></button>
                  <button onClick={() => setDeleting(p)} aria-label={`Delete ${p.name}`} className="rounded-lg border border-hairline p-2 text-muted hover:text-red-400"><Trash2 size={16} /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete "${deleting?.name}"?`}
        description="The project will be permanently removed from the gallery and admin views."
        confirmLabel="Delete"
        onConfirm={() => { if (deleting) { projectsRepo.remove(deleting.id); toast("Project deleted.", "success"); } setDeleting(null); }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
