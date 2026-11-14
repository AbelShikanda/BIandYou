"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";
import { membersRepo, type Member } from "@/lib/data";
import type { MemberKind } from "@/lib/mock-data";

export interface Session {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "member";
  kind: MemberKind;
  demo: true;
}

const COOKIE = "biandyou_session";
const MAX_AGE = 60 * 60 * 24 * 7;

function readCookie(): Session | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  if (!m) return null;
  try {
    return JSON.parse(decodeURIComponent(m[1])) as Session;
  } catch {
    return null;
  }
}

function writeCookie(s: Session | null) {
  if (typeof document === "undefined") return;
  if (!s) {
    document.cookie = `${COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(s))}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  signUp: (name: string, email: string, password: string, kind: MemberKind) => { ok: true } | { ok: false; error: string };
  signOut: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const syncFromMemberRecord = useCallback((s: Session | null): Session | null => {
    if (!s) return null;
    const rec = membersRepo.get(s.userId);
    if (rec && !rec.banned) return { ...s, role: rec.role, name: rec.name };
    if (rec?.banned) return null;
    return s;
  }, []);

  const refresh = useCallback(() => {
    const s = syncFromMemberRecord(readCookie());
    setSession(s);
    if (!s) writeCookie(null);
  }, [syncFromMemberRecord]);

  useEffect(() => {
    refresh();
    setLoading(false);
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener("biandyou:data-changed", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("biandyou:data-changed", onStorage);
    };
  }, [refresh]);

  const signIn: AuthContextValue["signIn"] = (email, password) => {
    const demo = siteConfig.demoAccounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (demo) {
      const rec = membersRepo.list().find((m) => m.email.toLowerCase() === demo.email);
      if (rec?.banned) return { ok: false, error: "This account has been banned." };
      const s: Session = { userId: rec?.id ?? demo.email, name: rec?.name ?? demo.name, email: demo.email, role: demo.role, kind: rec?.kind ?? "tech", demo: true };
      writeCookie(s);
      setSession(s);
      return { ok: true };
    }
    // fallback: locally-created account (password kept in a side table)
    try {
      const raw = window.localStorage.getItem("biandyou.credentials.v1");
      const creds: Record<string, string> = raw ? JSON.parse(raw) : {};
      const key = email.trim().toLowerCase();
      if (creds[key] && creds[key] === password) {
        const rec = membersRepo.list().find((m) => m.email.toLowerCase() === key);
        if (!rec) return { ok: false, error: "Account record missing." };
        if (rec.banned) return { ok: false, error: "This account has been banned." };
        const s: Session = { userId: rec.id, name: rec.name, email: rec.email, role: rec.role, kind: rec.kind, demo: true };
        writeCookie(s);
        setSession(s);
        return { ok: true };
      }
    } catch {
      /* fall through */
    }
    return { ok: false, error: "Invalid email or password." };
  };

  const signUp: AuthContextValue["signUp"] = (name, email, password, kind) => {
    const key = email.trim().toLowerCase();
    if (!name.trim() || !key || password.length < 3)
      return { ok: false, error: "Please fill all fields (password ≥ 3 chars)." };
    const exists = membersRepo.list().some((m) => m.email.toLowerCase() === key);
    if (exists) return { ok: false, error: "An account with that email already exists." };
    const rec: Member = membersRepo.create({
      name: name.trim(),
      handle: key.split("@")[0].replace(/[^a-z0-9_]/gi, "").slice(0, 20) || "member",
      email: key,
      role: "member",
      kind,
      title: kind === "startup" ? "Founder" : kind === "student" ? "Student" : "Tech community",
      bio: "New BIandYou member.",
      skills: [],
      links: {},
    });
    try {
      const raw = window.localStorage.getItem("biandyou.credentials.v1");
      const creds: Record<string, string> = raw ? JSON.parse(raw) : {};
      creds[key] = password;
      window.localStorage.setItem("biandyou.credentials.v1", JSON.stringify(creds));
    } catch {
      /* ignore */
    }
    const s: Session = { userId: rec.id, name: rec.name, email: rec.email, role: "member", kind, demo: true };
    writeCookie(s);
    setSession(s);
    return { ok: true };
  };

  const signOut = () => {
    writeCookie(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signUp, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
