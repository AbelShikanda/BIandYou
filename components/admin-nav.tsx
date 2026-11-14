"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, CalendarDays, Rocket, MessagesSquare, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/members", label: "Members", icon: Users },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/projects", label: "Projects", icon: Rocket },
  { href: "/admin/discussions", label: "Discussions", icon: MessagesSquare },
  { href: "/admin/resources", label: "Resources", icon: BookOpen },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin sections" className="mb-6 flex gap-1.5 overflow-x-auto border-b border-hairline pb-3">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors",
              active ? "border-lime/40 bg-lime/10 text-lime" : "border-hairline bg-surface-800 text-muted hover:text-white"
            )}
          >
            <Icon size={13} aria-hidden /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
