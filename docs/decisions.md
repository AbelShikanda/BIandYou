# BIandYou — Decision Log (lightweight ADRs)

_Last updated: 2026-11-14_

## #001 Stack: Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui
- **Context:** Need a deployable (Vercel), fast, mobile-first members app with
  server/client flexibility.
- **Decision:** Next.js App Router + TS, Tailwind for styling, shadcn/ui for
  accessible base primitives (button, dialog, toast, input, table).
- **Consequences:** Familiar patterns; easy Vercel deploy; shadcn components are
  owned source (copy-in), no heavy runtime.
- **Alternatives considered:** Remix (fine but less deploy familiarity), plain
  Vite SPA (loses SEO/metadata story).

## #002 R3F + Drei for the 3D hero
- **Context:** Centerpiece must be an interactive "community network": glowing
  nodes, connecting lines, hover labels, parallax, idle auto-rotate,
  prefers-reduced-motion freeze.
- **Decision:** React Three Fiber + Drei, lazy-loaded via `next/dynamic` (ssr:
  false), instanced meshes / low-poly primitives, DPR capped 1.5, no bloom by
  default. Gradient placeholder until canvas mounts.
- **Consequences:** Bundle cost isolated to landing route; mobile stays smooth.
- **Alternatives considered:** Three.js raw (more boilerplate, worse React
  ergonomics), CSS/canvas 2D (less "living network" feel), post-processing
  bloom (rejected by default; reserved for a toggle if perf allows).

## #003 Mock auth + localStorage persistence
- **Context:** Spec demands simulated auth with Clerk/Auth.js swap path, roles
  admin/member, mutations persisting so the demo "feels real".
- **Decision:** `/lib/auth` — email+password check against seeded demo accounts,
  session serialized in a cookie (readable client-side); `/lib/data` — typed
  repositories seeded from `/lib/mock-data.ts`, overlaid with localStorage diffs
  for mutations. Admin actions write through the same repositories, so member
  views reflect changes instantly.
- **Consequences:** Zero backend; data resets on localStorage clear; swap path =
  replace repository implementations with Supabase/Postgres calls.
- **Alternatives considered:** In-memory only (mutations lost on reload), MSW
  API layer (extra moving parts, no real benefit here).

## #004 Role model: member ↔ admin, two roles only
- **Context:** Spec: roles "admin" and "member".
- **Decision:** `role: 'admin' | 'member'` on session + user record. Admin gate
  in the admin layout wrapper; last-admin and self-ban/delete guards.
- **Consequences:** Simple, sufficient; richer roles later = extend enum + gate.
- **Alternatives considered:** RBAC with permission sets — overkill for demo.

## #005 Docs-in-repo, living documents
- **Context:** §9 requires self-documenting build with dated living docs.
- **Decision:** `/docs` holds goals/tasks/progress/decisions/agents/actions +
  README index; updated per phase. Stale docs treated as bugs.
- **Consequences:** Slight overhead per phase; high traceability.
- **Alternatives considered:** External wiki — rejected, violates self-containment.

## #006 No skills document
- **Context:** §9: "No skills.md. Skills are out of scope."
- **Decision:** Only repeatable build actions live in `docs/actions.md`. One-off
  work lives in `docs/tasks.md`.
- **Consequences:** None beyond file boundaries.
- **Alternatives considered:** skills.md — explicitly out of scope.

## #007 3D perf budget
- **Context:** Mid-range phones must hold 30fps+; desktop 60fps.
- **Decision:** Low-poly icosahedron/sphere nodes, `<Line>`/buffer geometry for
  edges, instancing where counts are high, DPR ≤ 1.5, frameloop demand-ish
  (slow auto-rotate), reduced-motion = static single frame, lazy load.
- **Consequences:** Hero looks intentional, not AAA; stability wins.
- **Alternatives considered:** Unreal bloom + physics — blows budget.

## #008 Styling: Tailwind + CSS variables, dark-only
- **Context:** Pure black identity, layered near-blacks, hairline borders,
  accent glows, glassmorphism only on overlays.
- **Decision:** Tailwind utilities + CSS custom properties in globals.css;
  gradient-border card utility; accent usage ≤ ~10% of screen.
- **Consequences:** No theme toggle (disabled w/ tooltip: "dark is the only mode").
- **Alternatives considered:** shadcn default slate palette — replaced with custom tokens.

## #009 Noindex member & admin routes via metadata
- **Context:** Members-only content shouldn't rank; spec asks for a note once real auth lands.
- **Decision:** `robots: { index: false }` exported from member/admin page trees; README documents adding header/middleware when real auth exists.
- **Consequences:** Demo deploys stay out of search; no extra infra.
- **Alternatives considered:** `X-Robots-Tag` via middleware — deferred until real auth.

## #010 ⌘K command palette + ¯\\_(ツ)_/¯ dark-only tooltip
- **Context:** Spec §7 nice-to-haves.
- **Decision:** Small client-side palette (⌘K/Ctrl+K, Esc, arrow keys) over routes + signout; user menu contains a "Theme: dark only" button that toasts "Dark is the only mode — always on brand" instead of a fake toggle.
- **Consequences:** Perceived product depth at near-zero cost; no dead controls.
- **Alternatives considered:** Real theme toggle — rejected; dark-only is a hard constraint.

## #011 Cookie session over localStorage for auth
- **Context:** §1 allowed either; spec said roles must gate admin.
- **Decision:** Session JSON in `biandyou_session` cookie (SameSite=Lax, 7d); client reads it; admin gate re-checks fresh member record from localStorage so bans/demotions take effect immediately on refresh.
- **Consequences:** Simple and honest for demo; swap = Clerk/Auth.js adapter (README).
- **Alternatives considered:** localStorage-only session — cookies survive more navigation edge-cases and document intent better.
