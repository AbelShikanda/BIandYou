"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface Item {
  label: string;
  href: string;
  group: "Navigate" | "Admin" | "Actions";
  keywords: string;
}

export function CommandPalette() {
  const { session, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items = useMemo<Item[]>(() => {
    const nav: Item[] = [
      { label: "Home", href: "/", group: "Navigate", keywords: "landing" },
      { label: "Dashboard", href: "/dashboard", group: "Navigate", keywords: "feed home" },
      { label: "Events", href: "/events", group: "Navigate", keywords: "calendar demo day" },
      { label: "Members", href: "/members", group: "Navigate", keywords: "directory people" },
      { label: "Projects", href: "/projects", group: "Navigate", keywords: "gallery ship" },
      { label: "Discussions", href: "/discussions", group: "Navigate", keywords: "threads forum" },
      { label: "Resources", href: "/resources", group: "Navigate", keywords: "links vault" },
      { label: "My profile", href: "/profile", group: "Navigate", keywords: "account edit" },
    ];
    const admin: Item[] =
      session?.role === "admin"
        ? [
            { label: "Admin overview", href: "/admin", group: "Admin", keywords: "stats" },
            { label: "Admin: Members", href: "/admin/members", group: "Admin", keywords: "ban promote" },
            { label: "Admin: Events", href: "/admin/events", group: "Admin", keywords: "create crud" },
            { label: "Admin: Projects", href: "/admin/projects", group: "Admin", keywords: "approve" },
            { label: "Admin: Discussions", href: "/admin/discussions", group: "Admin", keywords: "moderate pin lock" },
            { label: "Admin: Resources", href: "/admin/resources", group: "Admin", keywords: "crud" },
          ]
        : [];
    const actions: Item[] = session
      ? [{ label: "Sign out", href: "__signout__", group: "Actions", keywords: "logout" }]
      : [
          { label: "Sign in", href: "/login", group: "Actions", keywords: "login" },
          { label: "Request access", href: "/signup", group: "Actions", keywords: "join" },
        ];
    return [...nav, ...admin, ...actions];
  }, [session]);

  const q = query.trim().toLowerCase();
  const filtered = q ? items.filter((i) => `${i.label} ${i.keywords}`.toLowerCase().includes(q)) : items;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setIndex(0);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => setIndex(0), [filtered.length]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette (⌘K)"
        className="fixed bottom-24 right-4 z-40 hidden min-h-[44px] items-center gap-2 rounded-full border border-hairline bg-surface-800/90 px-4 text-xs text-muted shadow-lg backdrop-blur-md transition-colors hover:border-cyan/40 hover:text-white md:bottom-6 md:flex"
      >
        <Search size={14} aria-hidden /> Search <kbd className="rounded border border-hairline bg-surface-900 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>
    );
  }

  const choose = (item: Item) => {
    setOpen(false);
    if (item.href === "__signout__") {
      signOut();
      router.push("/");
      return;
    }
    router.push(item.href);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/70 p-4 pt-24 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Command palette" onClick={() => setOpen(false)}>
      <div className="glass-overlay w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-hairline px-4">
          <Search size={17} className="text-muted" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setIndex((i) => Math.min(i + 1, filtered.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
              else if (e.key === "Enter" && filtered[index]) choose(filtered[index]);
            }}
            placeholder="Jump to… (type to filter)"
            className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder-muted"
            aria-label="Search commands"
            aria-activedescendant={filtered[index] ? `cp-${index}` : undefined}
            role="combobox"
            aria-expanded="true"
            aria-controls="cp-list"
          />
          <kbd className="rounded border border-hairline bg-surface-900 px-1.5 py-0.5 text-[10px] text-muted">esc</kbd>
        </div>
        <ul id="cp-list" ref={listRef} role="listbox" className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted">No matches for “{query}”.</li>}
          {filtered.map((item, i) => (
            <li key={item.href + item.label} role="option" aria-selected={i === index} id={`cp-${i}`}>
              <button
                onMouseEnter={() => setIndex(i)}
                onClick={() => choose(item)}
                className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-sm ${i === index ? "bg-cyan/10 text-cyan" : "text-white"}`}
              >
                <span>{item.label}<span className="ml-2 text-[10px] uppercase tracking-wider text-muted">{item.group}</span></span>
                {i === index && <CornerDownLeft size={14} aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
