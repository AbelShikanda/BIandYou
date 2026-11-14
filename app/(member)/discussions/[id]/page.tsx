"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Lock, MessageSquare, Pin, Send, Flag } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useDiscussions, useMembers } from "@/components/use-biandyou-data";
import { discussionsRepo } from "@/lib/data";
import { useToast } from "@/components/toast";
import { Avatar, EmptyState } from "@/components/states";
import { siteConfig } from "@/lib/site-config";
import { relativeDate } from "@/lib/utils";

export default function ThreadPage() {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const threads = useDiscussions();
  const members = useMembers();
  const toast = useToast();
  const router = useRouter();
  const [body, setBody] = useState("");

  const thread = threads.find((t) => t.id === id);
  const memberById = (mid: string) => members.find((m) => m.id === mid);

  if (!thread) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState title="Thread not found" hint="It may have been removed by a moderator." action={<button className="btn-ghost" onClick={() => router.push("/discussions")}>Back to feed</button>} />
      </div>
    );
  }

  const author = memberById(thread.authorId);

  const reply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !body.trim()) return;
    if (thread.locked) {
      toast("This thread is locked.", "error");
      return;
    }
    discussionsRepo.reply(thread.id, session.userId, body.trim());
    setBody("");
    toast("Reply posted.", "success");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <button onClick={() => router.back()} className="flex min-h-[44px] items-center gap-1.5 text-sm text-muted hover:text-white"><ArrowLeft size={16} aria-hidden /> Back</button>

      <article className="hairline-card mt-2 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
          {thread.pinned && <span className="flex items-center gap-1 text-lime"><Pin size={11} aria-hidden /> Pinned</span>}
          {thread.locked && <span className="flex items-center gap-1"><Lock size={11} aria-hidden /> Locked</span>}
          {thread.reported && <span className="flex items-center gap-1 text-red-400"><Flag size={11} aria-hidden /> Reported</span>}
        </div>
        <h1 className="mt-2 font-display text-xl font-bold leading-snug tracking-tight sm:text-2xl">{thread.title}</h1>
        <div className="mt-3 flex items-center gap-2.5">
          {author && <Avatar name={author.name} color={author.color} size={34} />}
          <div>
            <p className="text-sm font-medium text-white">{author?.name}</p>
            <p className="text-[11px] text-muted">{relativeDate(thread.createdAt)}</p>
          </div>
        </div>
        <p className="mt-4 leading-relaxed text-white/90">{thread.body}</p>
      </article>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">{thread.replies.length} {thread.replies.length === 1 ? "reply" : "replies"}</h2>
        <a href={siteConfig.discordInvite} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-violet hover:underline"><MessageSquare size={12} aria-hidden /> Continue in Discord</a>
      </div>

      <ol className="mt-3 space-y-3">
        {thread.replies.map((r) => {
          const ra = memberById(r.authorId);
          return (
            <li key={r.id} className={`hairline-card flex items-start gap-3 p-4 ${r.flagged ? "border-red-500/30" : ""}`}>
              {ra && <Avatar name={ra.name} color={ra.color} size={32} />}
              <div className="min-w-0">
                <p className="text-[11px] text-muted">
                  <span className="font-medium text-white">{ra?.name}</span> · {relativeDate(r.createdAt)}
                  {r.flagged && <span className="ml-2 text-red-400">· flagged</span>}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/90">{r.body}</p>
              </div>
            </li>
          );
        })}
        {thread.replies.length === 0 && <li className="text-sm text-muted">No replies yet — start the conversation.</li>}
      </ol>

      {thread.locked ? (
        <p className="mt-5 flex items-center gap-2 rounded-xl border border-hairline bg-surface-800 px-4 py-3 text-sm text-muted"><Lock size={15} aria-hidden /> This thread is locked. Continue in Discord.</p>
      ) : (
        <form onSubmit={reply} className="mt-5 flex items-end gap-2">
          <label className="flex-1">
            <span className="sr-only">Write a reply</span>
            <textarea
              className="input min-h-[52px]"
              rows={2}
              placeholder="Add a reply…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              aria-label="Write a reply"
            />
          </label>
          <button type="submit" className="btn-primary" aria-label="Post reply"><Send size={16} aria-hidden /></button>
        </form>
      )}
    </div>
  );
}
