# BIandYou — Task List

_Last updated: 2026-11-14_

## Phase 1 — Setup
- [x] Docs scaffold created before UI
- [x] Next.js 14 + TypeScript scaffold (App Router)
- [x] Tailwind CSS (no separate shadcn CLI; primitives copied in, shadcn-style)
- [x] Deps: three/@react-three/fiber/drei, framer-motion, lucide-react

## Phase 2 — Design system
- [x] `/lib/site-config.ts` (name, logo, accents, links, demo accounts)
- [x] globals.css: tokens, focus rings, scrollbar, skeleton shimmer, glow helpers
- [x] Layout: next/font (Space Grotesk + Inter), metadata, OG tags, favicon.svg
- [x] `/lib/mock-data.ts` typed seed data (12 members, 8 events, 8 projects, 6 threads, 6 resources)
- [x] Data layer `/lib/data/` — localStorage repositories over seed
- [x] Auth `/lib/auth/` — cookie session, demo accounts, roles, "demo mode"
- [x] Toast + ConfirmDialog, Empty/Error/Skeleton state components

## Phase 3 — Public pages
- [x] `/` landing: 3D hero, value prop, animated stats, featured events/projects, CTA
- [x] 3D hero: R3F network, hover labels from mock data, parallax, auto-rotate, reduced-motion freeze, lazy-loaded
- [x] `/login` with demo badge + seeded accounts (tap-to-fill)
- [x] `/signup` demo signup (role: startup | student | tech)

## Phase 4 — Member pages
- [x] Gated layout wrapper ("Sign in to continue") + mobile bottom tab bar
- [x] `/dashboard`: upcoming events, recent discussions, new members, your projects
- [x] `/events` list (upcoming/past, category filter) + `/events/[id]` detail (RSVP, Google Calendar, Discord link, share)
- [x] `/members` directory (search + kind + skill filters) + `/members/[id]` profile
- [x] `/projects` gallery + `/projects/[id]` detail + submit-for-review form
- [x] `/discussions` feed + `/discussions/[id]` thread with persisted reply box + Discord link
- [x] `/resources` categorized cards
- [x] `/profile` edit own profile (localStorage, reflected everywhere)

## Phase 5 — Admin
- [x] `/admin` overview: stat cards, recent activity, quick actions
- [x] `/admin/members` table: search, promote/demote, ban/unban, delete; last-admin & self guards
- [x] `/admin/events` CRUD (title, desc, category, date/time, location, Discord link, published)
- [x] `/admin/projects` approve/reject/edit/delete + status filter tabs
- [x] `/admin/discussions` moderation: pin/lock/delete, reply flag/remove, report workflow
- [x] `/admin/resources` CRUD
- [x] All admin mutations persist + reflect in member views; toasts everywhere; destructive confirm dialogs

## Phase 6 — Polish
- [x] Bottom tab bar mobile; desktop top nav; Admin link visible to admins only
- [x] Footer: Discord invite, newsletter signup (placeholder), socials, copyright
- [x] ⌘K command palette; disabled-by-design dark-mode toggle with tooltip in user menu
- [x] Empty states / skeletons / error states for data views
- [x] README (setup, demo accounts, backend & auth swap, branding)
- [x] SEO: metadata, OG, favicon placeholder; members/admin pages noindexed

## Phase 7 — QA
- [x] `npm run build` clean (19 routes), `npm run lint` clean
- [x] All routes return 200 (start server smoke test)
- [x] 3D hero chunk lazy-loaded (landing First Load JS 122 kB)
- [x] Docs synced
