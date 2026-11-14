# BIandYou — /docs Index

Living documents. Keep them current; stale docs are a bug. All entries dated
`YYYY-MM-DD`.

| File | Purpose |
|------|---------|
| `goals.md` | Purpose, audience, success criteria, non-goals, constraints |
| `tasks.md` | Checkbox task list grouped by phase (Setup → QA) |
| `progress.md` | Append-only dated log: done / in-flight / blocked / next |
| `decisions.md` | Lightweight ADR log (#001…): context / decision / consequences / alternatives |
| `agents.md` | Roles operating on this build (single builder agent + internal phases) |
| `actions.md` | Repeatable actions only (add mock entity, wire gated route, mutation+toast, docs-after-phase, branding) |

## How to keep current
1. Start each phase by reading `tasks.md` and `progress.md`.
2. Do the work.
3. Tick `tasks.md`, append a dated entry to `progress.md`.
4. If a decision was made → add to `decisions.md`.
5. If a new repeatable action emerged → add to `actions.md` (one-offs go to tasks.md).
6. Update this README if files are added.

Tip: after any phase, run the checklist in `actions.md → update-docs-after-phase`.
