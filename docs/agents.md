# BIandYou — Agents / Roles

_Last updated: 2026-11-14_

This build is executed by a **single agent** operating through internal phases.
No external sub-agents are spawned; work is sequenced, not delegated.

## Single role: BIandYou builder agent
- **Responsibility:** End-to-end delivery of the BIandYou site — docs, scaffold,
  design system, 3D hero, public/member/admin pages, QA, README.
- **Inputs:** The product spec (Sections 1–10), repo state, docs/ as the source
  of truth for what's done.
- **Outputs:** Working Next.js app + kept-current docs.
- **Internal phases:**
  1. Docs-first (goals/tasks/decisions/agents before UI) — §9
  2. Setup & design system (tokens, site-config, mock data, auth/data layers)
  3. Public pages (landing + 3D hero, login, signup)
  4. Member area (dashboard, events, members, projects, discussions, resources, profile)
  5. Admin console (overview, members, events, projects, discussions, resources)
  6. Polish (nav/footer, palette, states, SEO, README) and QA
- **Handoffs:** None external. Each phase ends with: update progress.md, tick
  tasks.md, append decisions.md if a decision was made, refresh actions.md if a
  repeatable action emerged.
- **Guardrails:** Mock-data/auth layers stay isolated behind `/lib`; branding
  only in `site-config.ts`; no light mode; reduced-motion respected.
