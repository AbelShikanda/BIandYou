"use client";

import { useState } from "react";
import { Flag, Lock, Pin, Trash2, Trash } from "lucide-react";
import { useDiscussions, useMembers } from "@/components/use-biandyou-data";
import { discussionsRepo } from "@/lib/data";
import { useToast } from "@/components/toast";
import { AdminNav } from "@/components/admin-nav";
import { Avatar, EmptyState, SectionHeader } from "@/components/states";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { relativeDate, cn } from "@/lib/utils";

export default function AdminDiscussionsPage() {
  const threads = useDiscussions();
  const members = useMembers();
  const toast = useToast();
  const [deletingThread, setDeletingThread] = useState<string | null>(null);

  const memberById = (id: string) => members.find((m) => m.id === id);
  const sorted = [...threads].sort((a, b) => Number(b.reported) - Number(a.reported) || +new Date(b.lastActivityAt) - +new Date(a.lastActivityAt));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <AdminNav />
      <SectionHeader eyebrow="Admin" title="Discussion moderation" />

      {sorted.length === 0 ? (
        <EmptyState title="No threads" hint="Nothing to moderate yet." />
      ) : (
        <ul className="space-y-3">
          {sorted.map((t) => {
            const author = memberById(t.authorId);
            return (
              <li key={t.id} className={cn("hairline-card p-4 sm:p-5", t.reported && "border-red-500/30")}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider">
                      {t.reported && <span className="flex items-center gap-1 text-red-400"><Flag size={11} aria-hidden /> Reported</span>}
                      {t.pinned && <span className="flex items-center gap-1 text-lime"><Pin size={11} aria-hidden /> Pinned</span>}
                      {t.locked && <span className="flex items-center gap-1 text-muted"><Lock size={11} aria-hidden /> Locked</span>}
                    </p>
                    <h2 className="mt-1.5 font-display font-semibold leading-snug text-white">{t.title}</h2>
                    <p className="mt-1 text-[11px] text-muted">{author?.name} · {relativeDate(t.createdAt)} · {t.replies.length} replies</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => { discussionsRepo.update(t.id, { pinned: !t.pinned }); toast(t.pinned ? "Thread unpinned." : "Thread pinned.", "success"); }} aria-pressed={t.pinned} title={t.pinned ? "Unpin" : "Pin"} aria-label={t.pinned ? "Unpin thread" : "Pin thread"} className={cn("rounded-lg border border-hairline p-2", t.pinned ? "text-lime" : "text-muted hover:text-lime")}><Pin size={16} /></button>
                    <button onClick={() => { discussionsRepo.update(t.id, { locked: !t.locked }); toast(t.locked ? "Thread unlocked." : "Thread locked.", "success"); }} aria-pressed={t.locked} title={t.locked ? "Unlock" : "Lock"} aria-label={t.locked ? "Unlock thread" : "Lock thread"} className={cn("rounded-lg border border-hairline p-2", t.locked ? "text-cyan" : "text-muted hover:text-cyan")}><Lock size={16} /></button>
                    <button onClick={() => { discussionsRepo.update(t.id, { reported: !t.reported }); toast(t.reported ? "Report cleared." : "Marked as reported.", t.reported ? "info" : "success"); }} aria-pressed={t.reported} title="Toggle report flag" aria-label="Toggle report flag" className={cn("rounded-lg border border-hairline p-2", t.reported ? "text-red-400" : "text-muted hover:text-red-400")}><Flag size={16} /></button>
                    <button onClick={() => setDeletingThread(t.id)} title="Delete thread" aria-label="Delete thread" className="rounded-lg border border-hairline p-2 text-muted hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>

                {t.replies.length > 0 && (
                  <ol className="mt-4 space-y-2 border-t border-hairline pt-4">
                    {t.replies.map((r) => {
                      const ra = memberById(r.authorId);
                      return (
                        <li key={r.id} className={cn("flex flex-wrap items-start justify-between gap-2 rounded-xl border border-hairline bg-surface-900 p-3", r.flagged && "border-red-500/30")}>
                          <div className="flex min-w-0 items-start gap-2">
                            {ra && <Avatar name={ra.name} color={ra.color} size={26} />}
                            <div className="min-w-0">
                              <p className="text-[10px] text-muted">{ra?.name} · {relativeDate(r.createdAt)}{r.flagged && <span className="text-red-400"> · flagged</span>}</p>
                              <p className="mt-0.5 text-xs leading-relaxed text-white/85">{r.body}</p>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <button onClick={() => { discussionsRepo.toggleReplyFlag(t.id, r.id); toast(r.flagged ? "Reply unflagged." : "Reply flagged as reported.", "info"); }} aria-label={r.flagged ? "Unflag reply" : "Flag reply"} className={cn("rounded-md p-1.5", r.flagged ? "text-red-400" : "text-muted hover:text-red-400")}><Flag size={13} /></button>
                            <button onClick={() => { discussionsRepo.removeReply(t.id, r.id); toast("Reply removed.", "success"); }} aria-label="Remove reply" className="rounded-md p-1.5 text-muted hover:text-red-400"><Trash size={13} /></button>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={deletingThread !== null}
        title="Delete this thread?"
        description="The thread and all its replies will be permanently removed."
        confirmLabel="Delete thread"
        onConfirm={() => { if (deletingThread) { discussionsRepo.remove(deletingThread); toast("Thread deleted.", "success"); } setDeletingThread(null); }}
        onCancel={() => setDeletingThread(null)}
      />
    </div>
  );
}
