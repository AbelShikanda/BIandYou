"use client";

import { useState } from "react";
import { ExternalLink, Pencil, Plus, Trash2, X } from "lucide-react";
import { useResources } from "@/components/use-biandyou-data";
import { resourcesRepo } from "@/lib/data";
import { useToast } from "@/components/toast";
import { useAuth } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";
import { EmptyState, SectionHeader } from "@/components/states";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { Resource, ResourceCategory } from "@/lib/mock-data";

const categories: ResourceCategory[] = ["guides", "tools", "templates", "funding", "hiring", "learning"];
const emptyForm = { title: "", description: "", category: "guides" as ResourceCategory, url: "" };

export default function AdminResourcesPage() {
  const { session } = useAuth();
  const resources = useResources();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState<Resource | null>(null);

  const startCreate = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const startEdit = (r: Resource) => {
    setEditing(r);
    setForm({ title: r.title, description: r.description, category: r.category, url: r.url });
    setShowForm(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      url: form.url.trim(),
      addedBy: session?.name ?? "Admin",
    };
    if (editing) {
      resourcesRepo.update(editing.id, payload);
      toast("Resource updated.", "success");
    } else {
      resourcesRepo.create(payload);
      toast("Resource added.", "success");
    }
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <AdminNav />
      <SectionHeader
        eyebrow="Admin"
        title="Resources"
        action={<button className="btn-primary text-xs" onClick={startCreate}><Plus size={14} aria-hidden /> New resource</button>}
      />

      {showForm && (
        <form onSubmit={save} className="hairline-card mb-6 grid gap-3 p-5 sm:grid-cols-2">
          <div className="flex items-center justify-between sm:col-span-2">
            <h2 className="font-display font-semibold">{editing ? "Edit resource" : "New resource"}</h2>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="rounded-lg p-2 text-muted hover:text-white"><X size={18} /></button>
          </div>
          <div className="sm:col-span-2"><label htmlFor="r-title" className="label">Title</label><input id="r-title" required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="sm:col-span-2"><label htmlFor="r-desc" className="label">Description</label><textarea id="r-desc" required rows={2} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><label htmlFor="r-cat" className="label">Category</label><select id="r-cat" className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ResourceCategory })}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label htmlFor="r-url" className="label">URL</label><input id="r-url" required type="url" className="input" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" /></div>
          <button type="submit" className="btn-primary sm:col-span-2">{editing ? "Save changes" : "Add resource"}</button>
        </form>
      )}

      {resources.length === 0 ? (
        <EmptyState title="No resources" hint="Add the first link to the vault." />
      ) : (
        <ul className="space-y-2">
          {resources.map((r) => (
            <li key={r.id} className="hairline-card flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium text-white"><span className="chip capitalize text-violet border-violet/30">{r.category}</span>{r.title}</p>
                <p className="mt-1 truncate text-[11px] text-muted">{r.description}</p>
                <a href={r.url} target="_blank" rel="noreferrer" className="mt-0.5 flex items-center gap-1 text-[11px] text-cyan hover:underline"><ExternalLink size={10} aria-hidden /> {r.url}</a>
              </div>
              <button onClick={() => startEdit(r)} aria-label={`Edit ${r.title}`} className="rounded-lg border border-hairline p-2 text-muted hover:text-cyan"><Pencil size={16} /></button>
              <button onClick={() => setDeleting(r)} aria-label={`Delete ${r.title}`} className="rounded-lg border border-hairline p-2 text-muted hover:text-red-400"><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete "${deleting?.title}"?`}
        description="The resource will be removed from the vault."
        confirmLabel="Delete"
        onConfirm={() => { if (deleting) { resourcesRepo.remove(deleting.id); toast("Resource deleted.", "success"); } setDeleting(null); }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
