"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { membersRepo } from "@/lib/data";
import { useMembers } from "@/components/use-biandyou-data";
import { useToast } from "@/components/toast";
import { SectionHeader, Avatar } from "@/components/states";

export default function ProfilePage() {
  const { session, refresh } = useAuth();
  const members = useMembers();
  const toast = useToast();
  const me = members.find((m) => m.id === session?.userId);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [github, setGithub] = useState("");
  const [x, setX] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (!me) return;
    setName(me.name); setTitle(me.title); setBio(me.bio);
    setSkills(me.skills.join(", "));
    setGithub(me.links.github ?? ""); setX(me.links.x ?? ""); setLinkedin(me.links.linkedin ?? ""); setWebsite(me.links.website ?? "");
  }, [me?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!session) return null;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    membersRepo.update(session.userId, {
      name: name.trim() || session.name,
      title: title.trim(),
      bio: bio.trim(),
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12),
      links: {
        github: github.trim() || undefined,
        x: x.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        website: website.trim() || undefined,
      },
    });
    refresh();
    toast("Profile saved.", "success");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <SectionHeader eyebrow="You" title="Edit profile" />
      {me && (
        <div className="mb-5 flex items-center gap-4">
          <Avatar name={me.name} color={me.color} size={64} />
          <div>
            <p className="font-display font-semibold text-white">{me.name}</p>
            <p className="text-xs text-muted">@{me.handle} · {me.kind} · <span className="capitalize text-cyan">{me.role}</span></p>
          </div>
        </div>
      )}
      <form onSubmit={save} className="hairline-card space-y-4 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="name" className="label">Name</label><input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div><label htmlFor="title" className="label">Title</label><input id="title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        </div>
        <div><label htmlFor="bio" className="label">Bio</label><textarea id="bio" rows={3} className="input" value={bio} onChange={(e) => setBio(e.target.value)} /></div>
        <div><label htmlFor="skills" className="label">Skills (comma separated)</label><input id="skills" className="input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="react, postgres, rust" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="github" className="label">GitHub URL</label><input id="github" type="url" className="input" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/you" /></div>
          <div><label htmlFor="x" className="label">X URL</label><input id="x" type="url" className="input" value={x} onChange={(e) => setX(e.target.value)} /></div>
          <div><label htmlFor="linkedin" className="label">LinkedIn URL</label><input id="linkedin" type="url" className="input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} /></div>
          <div><label htmlFor="website" className="label">Website</label><input id="website" type="url" className="input" value={website} onChange={(e) => setWebsite(e.target.value)} /></div>
        </div>
        <button type="submit" className="btn-primary"><Save size={16} aria-hidden /> Save changes</button>
      </form>
    </div>
  );
}
