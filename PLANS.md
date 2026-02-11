# Github Action Environment Editor

---

## Metadata

- **Owner:** Christoph Hoffmann
- **Created:** 2026-01-05
- **Last Updated:** 2026-02-11
- **Agent / Module:** codex
- **Related Plans:** none
- **Plan Policy (if applicable):** `PLANS.md` (this plan must comply)

---

## Build a GitHub Actions Environment Editor web app

Based on the Nuxt template and the GitHub REST API definition, create a web application that can:

- authenticate against the GitHub API
- list repositories
- display and edit a repository's environments
- display and edit a repository's secrets and variables
- delete a repository's actions caches

---

## Purpose / Big Picture

Facilitate managing GitHub Actions environments across repositories in a single UI.

---

## Context and Orientation

- UI: use https://www.shadcn-vue.com/ components
- Reference UIs: https://www.shadcn-vue.com/examples/tasks and https://www.shadcn-vue.com/examples/playground
- API: use https://github.com/github/rest-api-description for GitHub REST endpoints
- Tests: do not create tests for now
- Auth: GitHub OAuth App with `repo` scope; store tokens in server-side session
- Target code locations:
  - `app/` for pages, layouts, components, composables
  - `server/` for API routes and server-side auth helpers
- Primary routes (draft):
  - `/login` (GitHub OAuth entry)
  - `/repos` (repo list)
  - `/repos/:owner/:repo/environments`
  - `/repos/:owner/:repo/secrets`
  - `/repos/:owner/:repo/variables`
  - `/repos/:owner/:repo/caches`

---

## Progress

Track all steps with checkboxes and timestamps.

- [ ] (2026-02-11 00:00 Z) Define OAuth flow + required env vars (client id/secret, callback URL).
- [ ] (2026-02-11 00:00 Z) Build auth UI and server route(s) for token exchange/storage.
- [ ] (2026-02-11 00:00 Z) Implement repo listing UI and API integration.
- [ ] (2026-02-11 00:00 Z) Implement environments list + edit UI.
- [ ] (2026-02-11 00:00 Z) Implement secrets and variables list + edit UI.
- [ ] (2026-02-11 00:00 Z) Implement actions cache deletion UI.

Use UTC timestamps to visualize progress rate.
Always keep this list current - it's the "truth" for status.
Every stopping point must be reflected here (split partially completed tasks into "done" vs "remaining").

---

## Surprises & Discoveries

Note any unexpected findings, side effects, optimizations, or new questions.

- None yet.

---

## Decision Log

Every material decision should be logged:

- **Decision:** Use server routes in `server/` to broker GitHub API requests.
- **Rationale:** Keep tokens off the client and simplify CORS/auth handling.
- **Date/Author:** 2026-02-11 - C. Hoffmann
- **Decision:** Use GitHub OAuth App with `repo` scope and server-side session storage.
- **Rationale:** Full repo access for environments/secrets/variables/caches while keeping tokens off the client.
- **Date/Author:** 2026-02-11 - C. Hoffmann

---
