# BIandYou — Goals

_Last updated: 2026-11-14_

## Purpose
BIandYou is a members-only community website for startups, students, and the tech
community — a hub for networking, events, projects, discussions, and shared
resources. The site should feel like a living, futuristic network.

## Target audience
- Founders / startup teams
- Students (CS, design, business)
- Tech professionals and indie builders

## Success criteria
- Runs with `npm install && npm run dev`; deployable to Vercel.
- Mobile-first (375px), flawless 320px → 4K. Bottom tab bar on mobile members area.
- Interactive 3D hero, pure-black high-contrast identity, medium-level motion.
- Full members-only area + role-gated admin console with localStorage-persisted
  mutations.
- WCAG AA contrast, keyboard navigable, visible focus rings, reduced-motion support.
- Lighthouse 90+ mobile (Perf/A11y/BP/SEO) as a target.

## Non-goals
- No real backend/database (mock data + localStorage only).
- No real auth provider (simulated; Clerk/Auth.js swappable later).
- No light mode. No post-processing bloom by default (toggleable only if cheap).
- Newsletter signup is a non-functional placeholder.

## Constraints
- Members-only behind demo auth; admin role-gated.
- Dark-only theme; accents ≤ ~10% of any screen.
- 3D perf budget: low-poly, instanced meshes, DPR ≤ 1.5, no bloom by default,
  lazy-loaded canvas, static frame under prefers-reduced-motion.
- All branding centralized in `/lib/site-config.ts`.
