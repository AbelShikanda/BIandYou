# BIandYou — Members-Only Community

A living, futuristic members-only community hub for startups, students, and the
tech community. Pure-black, high-contrast, interactive 3D centerpiece,
medium-level motion, mobile-first. Dark is the only mode.

> **Demo mode** — all auth, data, and integrations are simulated. Content is
> realistic placeholder; see `lib/mock-data.ts`.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start
npm run lint
```

Requires Node 18.18+ (Node 20+ recommended).

## Demo accounts

| Role   | Email             | Password |
|--------|-------------------|----------|
| Admin  | `admin@biandyou.dev`  | `admin`  |
| Member | `member@biandyou.dev` | `member` |

Signup works too (instant approval, role: startup | student | tech).

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui-style primitives
· React Three Fiber + Drei (3D hero) · Framer Motion · Lucide icons · cookie
session demo auth · localStorage persistence.

## Project structure

```
app/
  page.tsx                 Landing (3D hero + featured content)
  login/  signup/          Demo auth
  (member)/                Members-only routes (gated via AuthProvider cookie)
    dashboard/  events/  members/  projects/  discussions/  resources/  profile/
  admin/                   Admin-only console (role === "admin" gate)
    page.tsx  members/  events/  projects/  discussions/  resources/
  layout.tsx               Fonts, metadata/OG, providers, Nav/Footer, ⌘K palette
components/                nav, footer, toast, confirm-dialog, states, nav tab bar…
lib/
  site-config.ts           ★ ALL branding lives here ★
  site-config.ts           name, logo, tagline, accents, Discord, socials, demo accounts
  mock-data.ts             Typed seed data (members, events, projects, discussions, resources)
  data/                    Repositories — localStorage-backed, swap for a real DB here
  auth/                    Simulated auth — cookie session, roles; swap for Clerk/Auth.js here
docs/                      Living build docs (goals/tasks/progress/decisions/agents/actions)
```

## Swapping in a real backend (Supabase/Postgres)

`lib/data/index.ts` exposes typed repositories: `membersRepo`, `eventsRepo`,
`projectsRepo`, `discussionsRepo`, `resourcesRepo` (all synchronous today; localStorage-backed).

To go live:

1. Create tables matching the interfaces in `lib/mock-data.ts`
   (`Member`, `HubEvent`, `Project`, `DiscussionThread`, `Resource`).
2. Reimplement the repository functions to call Supabase/Postgres. Make them
   async and update call sites (`useEffect` loaders in `components/use-biandyou-data.ts`).
3. Delete the localStorage seed-on-read behavior in `read()`/`write()`.
4. Mutations (RSVP, ban, approve…) already funnel through the repositories —
   no UI changes required.
5. Wrap admin mutations in server actions / route handlers with real role
   checks (replace the cookie-session check in `lib/auth`).

## Swapping in real auth (Clerk / Auth.js)

`lib/auth/index.tsx` provides `AuthProvider`, `useAuth()` with
`signIn / signUp / signOut / session { userId, name, email, role, kind }`.

Clerk: replace `AuthProvider` with `<ClerkProvider>`, map `publicMetadata.role`
(`admin` | `member`) onto a `useAuth`-compatible adapter in `lib/auth`, keep the
same `session` shape. Auth.js: same idea — implement the adapter in one file.
Demo accounts disappear with the swap; seed admins via your provider's
metadata or an `ADMIN_EMAILS` env check.

## Customizing branding

Everything lives in **one place**: `lib/site-config.ts` — name, logo text,
tagline, description, accent hex codes, Discord invite, socials, newsletter
copy. Accents are exposed as CSS variables in `app/globals.css` and Tailwind
theme colors (`tailwind.config.ts`). The 3D node colors read from the same
palette.

## Integrations (all demo/placeholder)

- **Discord** — invite button in nav/footer/discussions (`site-config.discordInvite`).
- **Google Calendar** — event detail → "Google Calendar" opens a prefilled
  `calendar.google.com/calendar/render` template link.
- **Newsletter** — footer form, validates email, shows a success toast; sends nothing.

## SEO / indexing

Public pages (`/`, `/login`, `/signup`) are indexable with full metadata + OG
tags (`app/layout.tsx`). Member and admin pages set `robots: { index: false }`.
Once real auth lands, keep them noindexed (and consider `X-Robots-Tag` headers
or middleware) until you decide they should be public.

## Accessibility & motion

WCAG-AA-minded contrast on black; visible cyan focus rings; semantic landmarks;
aria labels on icon buttons; `prefers-reduced-motion` freezes the 3D scene to a
static frame and disables non-essential animation. Bottom tab bar on mobile;
44px+ touch targets.

## Performance notes

- 3D scene lazy-loads via `next/dynamic` (never blocks first paint or scroll);
  DPR capped at 1.5; low-poly instanced-style geometry; no post-processing bloom.
- Below-fold sections are static; fonts via `next/font` (Space Grotesk + Inter).
- No layout shift: fixed nav height, skeleton states for data views.

## Docs

See `docs/README.md` — goals, tasks, progress, decisions, agents, actions are
living documents maintained through the build.
