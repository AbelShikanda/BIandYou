"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, MoonStar, Shield, User } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { useToast } from "@/components/toast";

const memberLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/events", label: "Events" },
  { href: "/members", label: "Members" },
  { href: "/projects", label: "Projects" },
  { href: "/discussions", label: "Discussions" },
  { href: "/resources", label: "Resources" },
];

export function Nav() {
  const { session, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isAdmin = session?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-black/80 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-cyan focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6" aria-label="Primary">
        <Link href={session ? "/dashboard" : "/"} className="rounded-md" aria-label={`${siteConfig.name} home`}>
          <Logo />
        </Link>

        {session && (
          <ul className="hidden items-center gap-1 lg:flex">
            {memberLinks.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-md px-3 py-2 text-sm transition-colors ${
                      active ? "text-cyan" : "text-muted hover:text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    pathname.startsWith("/admin") ? "text-lime" : "text-lime/80 hover:text-lime"
                  }`}
                >
                  <Shield size={14} aria-hidden /> Admin
                </Link>
              </li>
            )}
          </ul>
        )}

        <div className="flex items-center gap-2">
          {!session ? (
            <>
              <Link href="/signup" className="btn-ghost hidden border-cyan/30 text-cyan hover:border-cyan hover:text-cyan sm:inline-flex">
                Join BIandYou
              </Link>
              <Link href="/login" className="btn-primary">Sign in</Link>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                className="flex min-h-[44px] items-center gap-2 rounded-lg border border-hairline bg-surface-800 py-1.5 pl-1.5 pr-2 text-sm text-white transition-colors hover:border-cyan/40"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-label="Account menu"
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan font-display text-xs font-bold text-black"
                  aria-hidden="true"
                >
                  {session.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                </span>
                <span className="hidden max-w-[120px] truncate sm:inline">{session.name}</span>
                <ChevronDown size={14} className="text-muted" aria-hidden />
              </button>
              {menuOpen && (
                <div className="glass-overlay absolute right-0 mt-2 w-56 overflow-hidden rounded-xl py-1.5 shadow-xl" role="menu">
                  <div className="border-b border-hairline px-4 py-2.5">
                    <p className="truncate text-sm font-semibold text-white">{session.name}</p>
                    <p className="truncate text-xs text-muted">{session.email}</p>
                    <span className="chip mt-1.5 border-cyan/30 text-cyan">demo mode · {session.role}</span>
                  </div>
                  <Link href="/profile" role="menuitem" className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-white">
                    <User size={15} aria-hidden /> My profile
                  </Link>
                  <Link href="/dashboard" role="menuitem" className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-white">
                    <LayoutDashboard size={15} aria-hidden /> Dashboard
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" role="menuitem" className="flex items-center gap-2 px-4 py-2.5 text-sm text-lime/90 hover:bg-white/5 hover:text-lime">
                      <Shield size={15} aria-hidden /> Admin console
                    </Link>
                  )}
                  <button
                    role="menuitem"
                    onClick={() => toast("Dark is the only mode — always on brand.", "info")}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-white"
                    title="Dark is the only mode"
                  >
                    <MoonStar size={15} aria-hidden /> Theme: dark only
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      signOut();
                      toast("Signed out. See you around the network.", "info");
                      router.push("/");
                    }}
                    className="flex w-full items-center gap-2 border-t border-hairline px-4 py-2.5 text-sm text-muted hover:bg-white/5 hover:text-white"
                  >
                    <LogOut size={15} aria-hidden /> Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
