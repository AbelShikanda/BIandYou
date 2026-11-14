"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarPlus, Check, MapPin, MessageSquare, Share2, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { eventsRepo } from "@/lib/data";
import { useEvents } from "@/components/use-biandyou-data";
import { useToast } from "@/components/toast";
import { EmptyState, SectionHeader, Avatar } from "@/components/states";
import { useMembers } from "@/components/use-biandyou-data";
import { formatDateTime, googleCalendarUrl, cn } from "@/lib/utils";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const events = useEvents();
  const members = useMembers();
  const toast = useToast();
  const router = useRouter();
  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Event not found" hint="It may have been unpublished or deleted." action={<button className="btn-ghost" onClick={() => router.push("/events")}>Back to events</button>} />
      </div>
    );
  }

  const going = session ? event.attendees.includes(session.userId) : false;
  const attendees = members.filter((m) => event.attendees.includes(m.id));

  const toggleRsvp = () => {
    if (!session) return;
    const nowGoing = eventsRepo.rsvp(event.id, session.userId);
    toast(nowGoing ? "RSVP confirmed. See you there." : "RSVP removed.", "success");
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard.", "info");
    } catch {
      toast("Couldn't copy link.", "error");
    }
  };

  const calUrl = googleCalendarUrl({
    title: event.title,
    startIso: event.start,
    endIso: event.end,
    details: event.description,
    location: event.location,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <button onClick={() => router.back()} className="flex min-h-[44px] items-center gap-1.5 text-sm text-muted hover:text-white">
        <ArrowLeft size={16} aria-hidden /> Back
      </button>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span className="chip border-violet/30 text-violet">{event.category}</span>
        {!event.published && <span className="chip border-lime/30 text-lime">unpublished</span>}
      </div>
      <h1 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight sm:text-4xl">{event.title}</h1>
      <p className="mt-4 leading-relaxed text-muted">{event.description}</p>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="hairline-card p-4">
          <dt className="text-[11px] uppercase tracking-wider text-muted">When</dt>
          <dd className="mt-1 text-sm font-medium text-white">{formatDateTime(event.start)} → {formatDateTime(event.end)}</dd>
        </div>
        <div className="hairline-card p-4">
          <dt className="text-[11px] uppercase tracking-wider text-muted">Where</dt>
          <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-white"><MapPin size={13} aria-hidden /> {event.location}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={toggleRsvp} className={cn(going ? "btn-ghost border-lime/40 text-lime" : "btn-primary")} aria-pressed={going}>
          {going && <Check size={16} aria-hidden />} {going ? "You're going" : "RSVP"}
        </button>
        <a href={calUrl} target="_blank" rel="noreferrer" className="btn-ghost">
          <CalendarPlus size={16} aria-hidden /> Google Calendar
        </a>
        <a href={event.discordLink} target="_blank" rel="noreferrer" className="btn-ghost border-violet/40 text-violet hover:border-violet hover:text-violet">
          <MessageSquare size={16} aria-hidden /> Discord thread
        </a>
        <button onClick={share} className="btn-ghost" aria-label="Copy event link">
          <Share2 size={16} aria-hidden /> Share
        </button>
      </div>

      <section className="mt-8" aria-labelledby="attendees-h">
        <h2 id="attendees-h" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted"><Users size={14} aria-hidden /> {attendees.length} going</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {attendees.map((m) => (
            <li key={m.id} className="flex items-center gap-2 rounded-full border border-hairline bg-surface-800 py-1 pl-1 pr-3">
              <Avatar name={m.name} color={m.color} size={24} />
              <span className="text-xs text-white">{m.name}</span>
            </li>
          ))}
          {attendees.length === 0 && <li className="text-sm text-muted">Be the first to RSVP.</li>}
        </ul>
      </section>
    </div>
  );
}
