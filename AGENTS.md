# Repository Guidelines

## Project Structure & Module Organization

- `app/` contains the Nuxt application (pages, components, layouts, composables).
- `server/` holds server-side routes and API handlers.
- `public/` is for static assets served as-is (e.g., `/public/favicon.ico`).
- `i18n/` stores locale configuration and messages (`i18n/messages/`).
- `e2e/` contains Playwright tests, snapshots, and config.
- `docs/` includes contributor documentation and deployment notes.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies (Node 24, pnpm 10).
- `pnpm run dev`: start local dev server at `http://localhost:3000`.
- `pnpm run build`: create a production build using `.env.local`.
- `pnpm run start`: preview the production build locally.
- `pnpm run generate`: generate a static build (Nuxt generate).
- `pnpm run lint:check` / `pnpm run lint:fix`: run ESLint + Stylelint.
- `pnpm run format:check` / `pnpm run format:fix`: run `oxfmt`.
- `pnpm run types:check`: run Nuxt typecheck.

## Coding Style & Naming Conventions

- Follow ESLint/Stylelint rules from `@acdh-oeaw` configs; rely on `oxfmt` for formatting.
- Indentation and formatting are enforced by tooling; run format/lint before committing.
- Prefer clear, descriptive names aligned with Nuxt/Vue conventions (e.g., `useFoo` composables).

## Testing Guidelines

- End-to-end tests use Playwright in `e2e/` with snapshots in `e2e/snapshots/`.
- Run tests with `pnpm run test:e2e` (build first if needed).
- Update snapshots with `pnpm run test:e2e:update-snapshots`.

## Commit & Pull Request Guidelines

- Git history currently only shows "Initial commit"; no established commit style yet.
- Use short, imperative commit messages (optionally add a scope like `feat(ui): ...`).
- Pre-commit hook runs `lint-staged`; fix lint/format issues before pushing.
- PRs should describe the change, list key commands run, and include screenshots for UI changes.

## Environment & Configuration

- Copy `.env.local.example` to `.env.local` and set required `NUXT_PUBLIC_*` variables.
- For CI/CD variables and secrets, follow `docs/contributing.md`.
