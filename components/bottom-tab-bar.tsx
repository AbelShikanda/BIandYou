"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CalendarDays, LayoutDashboard, MessageSquare, Users } from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/members", label: "Members", icon: Users },
  { href: "/discussions", label: "Discuss", icon: MessageSquare },
];

export function BottomTabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-black/90 backdrop-blur-md md:hidden"
      aria-label="Bottom navigation"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                  active ? "text-cyan" : "text-muted"
                }`}
              >
                <Icon size={20} aria-hidden strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
