"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEvents } from "@/components/use-biandyou-data";
import { eventsRepo } from "@/lib/data";
import { useToast } from "@/components/toast";
import { AdminNav } from "@/components/admin-nav";
import { EmptyState, SectionHeader } from "@/components/states";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { formatDateTime } from "@/lib/utils";
import type { HubEvent, EventCategory } from "@/lib/mock-data";

const categories: EventCategory[] = ["workshop", "talk", "demo-day", "social", "hackathon", "office-hours"];
const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const emptyForm = {
  title: "",
  description: "",
  category: "talk" as EventCategory,
  start: toLocalInput(new Date(Date.now() + 86400000).toISOString()),
  end: toLocalInput(new Date(Date.now() + 90000000).toISOString()),
  location: "",
  discordLink: "https://discord.gg/biandyou-demo",
  published: true,
};

export default function AdminEventsPage() {
  const events = useEvents();
  const toast = useToast();
  const [editing, setEditing] = useState<HubEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState<HubEvent | null>(null);

  const startCreate = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const startEdit = (e: HubEvent) => {
    setEditing(e);
    setForm({
      title: e.title, description: e.description, category: e.category,
      start: toLocalInput(e.start), end: toLocalInput(e.end),
      location: e.location, discordLink: e.discordLink, published: e.published,
    });
    setShowForm(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      start: new Date(form.start).toISOString(),
      end: new Date(form.end).toISOString(),
      location: form.location.trim(),
      discordLink: form.discordLink.trim(),
      published: form.published,
    };
    if (editing) {
      eventsRepo.update(editing.id, payload);
      toast("Event updated.", "success");
    } else {
      eventsRepo.create(payload);
      toast("Event created.", "success");
    }
    setShowForm(false);
    setEditing(null);
  };

  const sorted = [...events].sort((a, b) => +new Date(a.start) - +new Date(b.start));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <AdminNav />
      <SectionHeader
        eyebrow="Admin"
        title="Events"
        action={<button className="btn-primary text-xs" onClick={startCreate}><Plus size={14} aria-hidden /> New event</button>}
      />

      {showForm && (
        <form onSubmit={save} className="hairline-card mb-6 grid gap-3 p-5 sm:grid-cols-2">
          <div className="flex items-center justify-between sm:col-span-2">
            <h2 className="font-display font-semibold">{editing ? "Edit event" : "New event"}</h2>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="rounded-lg p-2 text-muted hover:text-white"><X size={18} /></button>
          </div>
          <div className="sm:col-span-2"><label htmlFor="f-title" className="label">Title</label><input id="f-title" required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="sm:col-span-2"><label htmlFor="f-desc" className="label">Description</label><textarea id="f-desc" required rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><label htmlFor="f-cat" className="label">Category</label><select id="f-cat" className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as EventCategory })}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label htmlFor="f-loc" className="label">Location</label><input id="f-loc" required className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Room B + livestream" /></div>
          <div><label htmlFor="f-start" className="label">Starts</label><input id="f-start" required type="datetime-local" className="input" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></div>
          <div><label htmlFor="f-end" className="label">Ends</label><input id="f-end" required type="datetime-local" className="input" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></div>
          <div className="sm:col-span-2"><label htmlFor="f-discord" className="label">Discord thread link</label><input id="f-discord" type="url" className="input" value={form.discordLink} onChange={(e) => setForm({ ...form, discordLink: e.target.value })} /></div>
          <label className="flex min-h-[44px] items-center gap-2 text-sm text-muted sm:col-span-2">
            <input type="checkbox" className="h-4 w-4 accent-[#00E5FF]" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published (visible to members)
          </label>
          <button type="submit" className="btn-primary sm:col-span-2">{editing ? "Save changes" : "Create event"}</button>
        </form>
      )}

      {sorted.length === 0 ? (
        <EmptyState title="No events" hint="Create the first event." />
      ) : (
        <ul className="space-y-2">
          {sorted.map((e) => (
            <li key={e.id} className="hairline-card flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{e.title} {!e.published && <span className="chip ml-1 border-lime/30 text-lime">draft</span>}</p>
                <p className="mt-0.5 text-[11px] text-muted">{formatDateTime(e.start)} · {e.category} · {e.location}</p>
              </div>
              <button onClick={() => startEdit(e)} aria-label={`Edit ${e.title}`} className="rounded-lg border border-hairline p-2 text-muted hover:text-cyan"><Pencil size={16} /></button>
              <button onClick={() => setDeleting(e)} aria-label={`Delete ${e.title}`} className="rounded-lg border border-hairline p-2 text-muted hover:text-red-400"><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete "${deleting?.title}"?`}
        description="The event and its RSVP list will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => { if (deleting) { eventsRepo.remove(deleting.id); toast("Event deleted.", "success"); } setDeleting(null); }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
