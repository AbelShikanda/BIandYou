# BIandYou — Repeatable Actions

_Last updated: 2026-11-14. Only actions performed repeatedly during this build._

## add-mock-entity
- **When:** Adding a new mock member/event/project/thread/resource.
- **Steps:** 1) Add type (if missing) in `/lib/mock-data.ts`. 2) Add seed entries
  with stable ids. 3) Ensure localStorage overlay keys (`biandyou.<entity>`) are
  handled by the repository in `/lib/data/`. 4) Wire UI list/detail views.
- **Result:** Entity appears across member + admin views after reload.

## wire-gated-route
- **When:** Creating any members-only or admin-only page.
- **Steps:** 1) Place page under `app/(member)/…` or `app/admin/…`. 2) Member
  pages: wrapped by member layout (redirects to /login when signed out). 3)
  Admin pages: admin layout checks `session.role === 'admin'`, else redirect
  /dashboard. 4) Add `export const metadata` with `robots: { index: false }`.
- **Result:** Route is gated, noindexed, nav-linked as appropriate.

## add-mutation-with-toast
- **When:** Any create/edit/delete/approve/ban/RSVP action.
- **Steps:** 1) Call repository mutation (writes localStorage). 2) Refresh local
  state / re-read repository. 3) `toast.success(...)` or error. 4) Destructive →
  wrap in confirm dialog first.
- **Result:** Instant UI update + user feedback; persists across reloads.

## update-docs-after-phase
- **When:** After every phase in tasks.md completes.
- **Steps:** 1) Tick completed boxes in tasks.md. 2) Append dated entry to
  progress.md (done/in-flight/blocked/next). 3) Append decisions.md entries for
  any new decision. 4) Refresh actions.md if a new repeatable action emerged.
- **Result:** Docs never stale; §9 satisfied.

## keep-branding-centralized
- **When:** Touching name/logo/accents/links.
- **Steps:** Edit only `/lib/site-config.ts`. Never hardcode brand strings in pages.
- **Result:** One-file rebrand.
