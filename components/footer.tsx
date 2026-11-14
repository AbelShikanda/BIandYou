"use client";

import { useState } from "react";
import { Github, Linkedin, Twitter, Youtube, Send } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Logo } from "@/components/logo";
import { useToast } from "@/components/toast";

export function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast("Enter a valid email address.", "error");
      return;
    }
    setEmail("");
    toast("You're on the list (demo — no email is actually sent).", "success");
  };

  return (
    <footer className="border-t border-hairline bg-surface-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{siteConfig.description}</p>
            <div className="mt-4 flex items-center gap-2">
              {[
                { href: siteConfig.socials.github, label: "GitHub", icon: Github },
                { href: siteConfig.socials.x, label: "X", icon: Twitter },
                { href: siteConfig.socials.linkedin, label: "LinkedIn", icon: Linkedin },
                { href: siteConfig.socials.youtube, label: "YouTube", icon: Youtube },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${siteConfig.name} on ${label}`}
                  className="rounded-lg border border-hairline p-2.5 text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Community" className="text-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Community</h3>
            <ul className="mt-3 space-y-2 text-muted">
              <li><a href="/events" className="hover:text-white">Events</a></li>
              <li><a href="/projects" className="hover:text-white">Projects</a></li>
              <li><a href="/discussions" className="hover:text-white">Discussions</a></li>
              <li><a href="/members" className="hover:text-white">Member directory</a></li>
            </ul>
          </nav>
          <div className="text-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Discord</h3>
            <p className="mt-3 text-muted">The realtime heartbeat of BIandYou — 1,400+ members, daily threads, voice rooms.</p>
            <a
              href={siteConfig.discordInvite}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-3 border-violet/40 text-violet hover:border-violet hover:text-violet"
            >
              Join the Discord
            </a>
          </div>
          <form onSubmit={subscribe} className="text-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Newsletter</h3>
            <p className="mt-3 text-muted">One email a month: launches, talks, member wins. {siteConfig.newsletterNote}</p>
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <div className="mt-3 flex overflow-hidden rounded-lg border border-hairline focus-within:border-cyan/60">
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="min-h-[44px] w-full bg-surface-800 px-3 text-sm text-white outline-none placeholder-muted"
              />
              <button type="submit" aria-label="Subscribe to newsletter" className="bg-cyan px-4 text-black transition-colors hover:bg-cyan/80">
                <Send size={16} aria-hidden />
              </button>
            </div>
          </form>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-hairline pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Demo build — content is placeholder.</p>
          <p>Made for the BIandYou community · {siteConfig.email}</p>
        </div>
      </div>
    </footer>
  );
}
