"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Pin, Lock, Plus, Flag } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useDiscussions, useMembers } from "@/components/use-biandyou-data";
import { discussionsRepo } from "@/lib/data";
import { useToast } from "@/components/toast";
import { Avatar, EmptyState, SectionHeader } from "@/components/states";
import { siteConfig } from "@/lib/site-config";
import { relativeDate } from "@/lib/utils";

export default function DiscussionsPage() {
  const { session } = useAuth();
  const threads = useDiscussions();
  const members = useMembers();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const sorted = [...threads].sort((a, b) => Number(b.pinned) - Number(a.pinned) || +new Date(b.lastActivityAt) - +new Date(a.lastActivityAt));
  const memberName = (id: string) => members.find((m) => m.id === id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !title.trim() || !body.trim()) return;
    discussionsRepo.create({ title: title.trim(), body: body.trim(), tags: ["general"], authorId: session.userId });
    setTitle(""); setBody(""); setShowForm(false);
    toast("Thread posted.", "success");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <SectionHeader
        eyebrow="Community pulse"
        title="Discussions"
        action={
          <div className="flex flex-wrap gap-2">
            <a href={siteConfig.discordInvite} target="_blank" rel="noreferrer" className="btn-ghost border-violet/40 text-xs text-violet hover:border-violet hover:text-violet">
              <MessageSquare size={13} aria-hidden /> Discord
            </a>
            <button className="btn-primary text-xs" onClick={() => setShowForm((v) => !v)} aria-expanded={showForm}>
              <Plus size={13} aria-hidden /> New thread
            </button>
          </div>
        }
      />

      {showForm && (
        <form onSubmit={submit} className="hairline-card mb-5 space-y-3 p-5">
          <div><label htmlFor="t-title" className="label">Title</label><input id="t-title" required className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's on your mind?" /></div>
          <div><label htmlFor="t-body" className="label">Details</label><textarea id="t-body" required rows={3} className="input" value={body} onChange={(e) => setBody(e.target.value)} /></div>
          <button type="submit" className="btn-primary">Post thread</button>
        </form>
      )}

      {sorted.length === 0 ? (
        <EmptyState title="No threads yet" hint="Be the first to start a discussion." />
      ) : (
        <ul className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-surface-800">
          {sorted.map((t) => {
            const author = memberName(t.authorId);
            return (
              <li key={t.id}>
                <Link href={`/discussions/${t.id}`} className="flex min-h-[64px] items-start gap-3 px-4 py-4 transition-colors hover:bg-white/5 sm:px-5">
                  {author && <Avatar name={author.name} color={author.color} size={38} />}
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      {t.pinned && <Pin size={12} className="text-lime" aria-label="Pinned" />}
                      {t.locked && <Lock size={12} className="text-muted" aria-label="Locked" />}
                      {t.reported && <Flag size={12} className="text-red-400" aria-label="Reported" />}
                      <span className="font-medium leading-snug text-white">{t.title}</span>
                    </span>
                    <span className="mt-1 block text-[11px] text-muted">
                      {author?.name} · {t.replies.length} {t.replies.length === 1 ? "reply" : "replies"} · active {relativeDate(t.lastActivityAt)}
                    </span>
                    <span className="mt-1.5 flex flex-wrap gap-1">{t.tags.map((tag) => <span key={tag} className="chip">#{tag}</span>)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
