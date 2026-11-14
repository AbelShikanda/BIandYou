import {
  members as seedMembers,
  events as seedEvents,
  projects as seedProjects,
  discussions as seedDiscussions,
  resources as seedResources,
  type Member,
  type HubEvent,
  type Project,
  type DiscussionThread,
  type DiscussionReply,
  type Resource,
} from "@/lib/mock-data";

export type { Member, HubEvent, Project, DiscussionThread, DiscussionReply, Resource };

const isBrowser = () => typeof window !== "undefined";

const KEYS = {
  members: "biandyou.members.v1",
  events: "biandyou.events.v1",
  projects: "biandyou.projects.v1",
  discussions: "biandyou.discussions.v1",
  resources: "biandyou.resources.v1",
  rsvp: "biandyou.rsvp.v1",
} as const;

export const DATA_EVENT = "biandyou:data-changed";

function notify() {
  if (isBrowser()) window.dispatchEvent(new Event(DATA_EVENT));
}

function read<T>(key: string, seed: T): T {
  if (!isBrowser()) return seed;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) {
      window.localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  notify();
}

export function resetDemoData() {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
  notify();
}

const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/* ── Members ─────────────────────────────────────────── */
export const membersRepo = {
  list: (): Member[] => read(KEYS.members, seedMembers),
  get: (id: string): Member | undefined => membersRepo.list().find((m) => m.id === id),
  update: (id: string, patch: Partial<Member>): Member | null => {
    const all = membersRepo.list();
    const idx = all.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    const next = { ...all[idx], ...patch };
    all[idx] = next;
    write(KEYS.members, all);
    return next;
  },
  create: (data: Omit<Member, "id" | "joinedAt" | "banned" | "color">): Member => {
    const all = membersRepo.list();
    const member: Member = {
      ...data,
      id: uid("m"),
      joinedAt: new Date().toISOString(),
      banned: false,
      color: "#00E5FF",
    };
    write(KEYS.members, [...all, member]);
    return member;
  },
  remove: (id: string) => write(KEYS.members, membersRepo.list().filter((m) => m.id !== id)),
  countAdmins: () => membersRepo.list().filter((m) => m.role === "admin" && !m.banned).length,
};

/* ── Events ──────────────────────────────────────────── */
export const eventsRepo = {
  list: (): HubEvent[] => read(KEYS.events, seedEvents),
  get: (id: string) => eventsRepo.list().find((e) => e.id === id),
  create: (data: Omit<HubEvent, "id" | "attendees">): HubEvent => {
    const ev: HubEvent = { ...data, id: uid("e"), attendees: [] };
    write(KEYS.events, [ev, ...eventsRepo.list()]);
    return ev;
  },
  update: (id: string, patch: Partial<HubEvent>) => {
    const all = eventsRepo.list();
    const idx = all.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch };
    write(KEYS.events, all);
    return all[idx];
  },
  remove: (id: string) => write(KEYS.events, eventsRepo.list().filter((e) => e.id !== id)),
  rsvp: (id: string, memberId: string): boolean => {
    const all = eventsRepo.list();
    const ev = all.find((e) => e.id === id);
    if (!ev) return false;
    const going = ev.attendees.includes(memberId);
    ev.attendees = going ? ev.attendees.filter((a) => a !== memberId) : [...ev.attendees, memberId];
    write(KEYS.events, all);
    return !going;
  },
};

/* ── RSVP convenience (stored on events themselves) ──── */

/* ── Projects ────────────────────────────────────────── */
export const projectsRepo = {
  list: (): Project[] => read(KEYS.projects, seedProjects),
  get: (id: string) => projectsRepo.list().find((p) => p.id === id),
  create: (data: Omit<Project, "id" | "createdAt" | "status" | "color"> & { status?: Project["status"] }): Project => {
    const p: Project = { ...data, status: data.status ?? "pending", id: uid("p"), createdAt: new Date().toISOString(), color: "#7C3AED" };
    write(KEYS.projects, [p, ...projectsRepo.list()]);
    return p;
  },
  update: (id: string, patch: Partial<Project>) => {
    const all = projectsRepo.list();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch };
    write(KEYS.projects, all);
    return all[idx];
  },
  remove: (id: string) => write(KEYS.projects, projectsRepo.list().filter((p) => p.id !== id)),
};

/* ── Discussions ─────────────────────────────────────── */
export const discussionsRepo = {
  list: (): DiscussionThread[] => read(KEYS.discussions, seedDiscussions),
  get: (id: string) => discussionsRepo.list().find((t) => t.id === id),
  create: (data: Pick<DiscussionThread, "title" | "body" | "tags" | "authorId">): DiscussionThread => {
    const t: DiscussionThread = {
      ...data,
      id: uid("t"),
      replies: [],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      pinned: false,
      locked: false,
      reported: false,
    };
    write(KEYS.discussions, [t, ...discussionsRepo.list()]);
    return t;
  },
  reply: (threadId: string, authorId: string, body: string): DiscussionReply | null => {
    const all = discussionsRepo.list();
    const t = all.find((x) => x.id === threadId);
    if (!t) return null;
    const reply: DiscussionReply = { id: uid("r"), authorId, body, createdAt: new Date().toISOString() };
    t.replies = [...t.replies, reply];
    t.lastActivityAt = reply.createdAt;
    write(KEYS.discussions, all);
    return reply;
  },
  update: (id: string, patch: Partial<DiscussionThread>) => {
    const all = discussionsRepo.list();
    const idx = all.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch };
    write(KEYS.discussions, all);
    return all[idx];
  },
  removeReply: (threadId: string, replyId: string) => {
    const all = discussionsRepo.list();
    const t = all.find((x) => x.id === threadId);
    if (!t) return;
    t.replies = t.replies.filter((r) => r.id !== replyId);
    write(KEYS.discussions, all);
  },
  toggleReplyFlag: (threadId: string, replyId: string) => {
    const all = discussionsRepo.list();
    const t = all.find((x) => x.id === threadId);
    if (!t) return;
    t.replies = t.replies.map((r) => (r.id === replyId ? { ...r, flagged: !r.flagged } : r));
    write(KEYS.discussions, all);
  },
  remove: (id: string) => write(KEYS.discussions, discussionsRepo.list().filter((t) => t.id !== id)),
};

/* ── Resources ───────────────────────────────────────── */
export const resourcesRepo = {
  list: (): Resource[] => read(KEYS.resources, seedResources),
  create: (data: Omit<Resource, "id">): Resource => {
    const r: Resource = { ...data, id: uid("res") };
    write(KEYS.resources, [r, ...resourcesRepo.list()]);
    return r;
  },
  update: (id: string, patch: Partial<Resource>) => {
    const all = resourcesRepo.list();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch };
    write(KEYS.resources, all);
    return all[idx];
  },
  remove: (id: string) => write(KEYS.resources, resourcesRepo.list().filter((r) => r.id !== id)),
};
