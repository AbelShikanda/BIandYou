"use client";

import { useMemo, useState } from "react";
import { Ban, Check, Search, ShieldCheck, Trash2, Undo2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useMembers } from "@/components/use-biandyou-data";
import { membersRepo } from "@/lib/data";
import { useToast } from "@/components/toast";
import { AdminNav } from "@/components/admin-nav";
import { Avatar, EmptyState, SectionHeader } from "@/components/states";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { relativeDate } from "@/lib/utils";

type PendingAction =
  | { kind: "ban" | "unban" | "delete"; memberId: string; name: string }
  | { kind: "demote"; memberId: string; name: string }
  | null;

export default function AdminMembersPage() {
  const { session } = useAuth();
  const members = useMembers();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<PendingAction>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => [m.name, m.email, m.handle, m.kind, m.role, ...m.skills].join(" ").toLowerCase().includes(q));
  }, [members, query]);

  if (!session) return null;

  const adminCount = membersRepo.countAdmins();

  const guards = {
    isSelf: (id: string) => id === session.userId,
    isLastAdmin: (m: { id: string; role: string; banned: boolean }) => m.role === "admin" && !m.banned && adminCount <= 1,
  };

  const toggleRole = (m: (typeof members)[number]) => {
    if (m.role === "admin") {
      if (guards.isLastAdmin(m)) {
        toast("Can't demote the last active admin.", "error");
        return;
      }
      if (guards.isSelf(m.id)) {
        setPending({ kind: "demote", memberId: m.id, name: m.name });
        return;
      }
      membersRepo.update(m.id, { role: "member" });
      toast(`${m.name} demoted to member.`, "success");
    } else {
      membersRepo.update(m.id, { role: "admin" });
      toast(`${m.name} promoted to admin.`, "success");
    }
  };

  const confirmAction = () => {
    if (!pending) return;
    const target = members.find((m) => m.id === pending.memberId);
    if (!target) { setPending(null); return; }
    if (pending.kind === "delete") {
      if (guards.isSelf(target.id)) { toast("You can't delete your own account.", "error"); setPending(null); return; }
      if (guards.isLastAdmin(target)) { toast("Can't delete the last active admin.", "error"); setPending(null); return; }
      membersRepo.remove(target.id);
      toast(`${target.name} deleted.`, "success");
    } else if (pending.kind === "ban") {
      if (guards.isSelf(target.id)) { toast("You can't ban yourself.", "error"); setPending(null); return; }
      if (guards.isLastAdmin(target)) { toast("Can't ban the last active admin.", "error"); setPending(null); return; }
      membersRepo.update(target.id, { banned: true });
      toast(`${target.name} banned.`, "success");
    } else if (pending.kind === "unban") {
      membersRepo.update(target.id, { banned: false });
      toast(`${target.name} unbanned.`, "success");
    } else if (pending.kind === "demote") {
      membersRepo.update(target.id, { role: "member" });
      toast(`${target.name} demoted to member.`, "success");
    }
    setPending(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <AdminNav />
      <SectionHeader eyebrow="Admin" title="Member management" />
      <label className="relative block max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
        <span className="sr-only">Search members</span>
        <input className="input pl-9" placeholder="Search name, email, skill…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search members" />
      </label>

      {filtered.length === 0 ? (
        <div className="mt-6"><EmptyState title="No members match" hint="Try a different search." /></div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-hairline">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-surface-800 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th scope="col" className="px-4 py-3">Member</th>
                <th scope="col" className="px-4 py-3">Kind</th>
                <th scope="col" className="px-4 py-3">Role</th>
                <th scope="col" className="px-4 py-3">Joined</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline bg-surface-900">
              {filtered.map((m) => {
                const isSelf = guards.isSelf(m.id);
                const lastAdmin = guards.isLastAdmin(m);
                return (
                  <tr key={m.id} className={m.banned ? "opacity-60" : ""}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={m.name} color={m.color} size={34} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">{m.name}{isSelf && <span className="ml-1.5 text-[10px] text-cyan">(you)</span>}</p>
                          <p className="truncate text-[11px] text-muted">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted">{m.kind}</td>
                    <td className="px-4 py-3">
                      <span className={`chip ${m.role === "admin" ? "border-lime/30 text-lime" : ""}`}>{m.role}</span>
                    </td>
                    <td className="px-4 py-3 text-muted">{relativeDate(m.joinedAt)}</td>
                    <td className="px-4 py-3">{m.banned ? <span className="chip border-red-500/30 text-red-400">banned</span> : <span className="chip border-lime/30 text-lime">active</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => toggleRole(m)}
                          disabled={m.role === "admin" && lastAdmin}
                          title={m.role === "admin" ? "Demote to member" : "Promote to admin"}
                          aria-label={m.role === "admin" ? `Demote ${m.name}` : `Promote ${m.name}`}
                          className="rounded-lg border border-hairline p-2 text-muted transition-colors hover:border-lime/40 hover:text-lime disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ShieldCheck size={16} />
                        </button>
                        {m.banned ? (
                          <button onClick={() => setPending({ kind: "unban", memberId: m.id, name: m.name })} title="Unban" aria-label={`Unban ${m.name}`} className="rounded-lg border border-hairline p-2 text-muted hover:border-lime/40 hover:text-lime">
                            <Undo2 size={16} />
                          </button>
                        ) : (
                          <button onClick={() => setPending({ kind: "ban", memberId: m.id, name: m.name })} title="Ban" aria-label={`Ban ${m.name}`} className="rounded-lg border border-hairline p-2 text-muted hover:border-red-500/40 hover:text-red-400">
                            <Ban size={16} />
                          </button>
                        )}
                        <button onClick={() => setPending({ kind: "delete", memberId: m.id, name: m.name })} title="Delete" aria-label={`Delete ${m.name}`} className="rounded-lg border border-hairline p-2 text-muted hover:border-red-500/40 hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={pending !== null}
        title={pending?.kind === "delete" ? `Delete ${pending.name}?` : pending?.kind === "ban" ? `Ban ${pending.name}?` : pending?.kind === "demote" ? `Demote yourself?` : `Unban ${pending?.name}?`}
        description={pending?.kind === "delete" ? "Their profile, projects and RSVPs will be permanently removed from this demo." : pending?.kind === "ban" ? "They will be signed out and hidden from member views. You can unban later." : pending?.kind === "demote" ? "You will lose admin access immediately." : "They will regain access to member areas."}
        confirmLabel={pending?.kind === "delete" ? "Delete" : pending?.kind === "ban" ? "Ban" : pending?.kind === "demote" ? "Demote" : "Unban"}
        destructive={pending?.kind !== "unban"}
        onConfirm={confirmAction}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
