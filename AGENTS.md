# AGENTS.md

## Repo layout

- Two independent, unwired apps: `frontend/` (React Router SSR) and `backend/` (Bun). There is no root workspace or root `package.json`; run installs and scripts inside the relevant app directory.
- `backend/` is still a stub: `backend/index.ts` is empty (0 bytes), and Prisma is only a devDependency (`^8.0.0-rc.29` release candidate) with no schema or migrations. Do not assume API or database code exists.
- The root `readme.md` says "MERN Stack", but nothing is wired yet — the actual stack is React Router + Bun. Don't go looking for Express/Mongo code.

## Frontend (`frontend/`)

- React Router v8 Framework Mode with SSR (`react-router.config.ts`). Routes are declared centrally in `app/routes.ts`; adding a file under `app/routes/` does nothing until it is registered there.
- Route modules import generated types from `./+types/<route>` (`.react-router/` is gitignored). Run `bun run typecheck` after route changes; it runs `react-router typegen` before `tsc`.
- Commands: `bun install`, `bun run dev` (http://localhost:5173), `bun run build`, `bun run start`, `bun run typecheck`.
- React Router requires Node >= 22.22.0 (`engines` in `react-router/package.json`). Older Node (this machine runs 22.19) prints a version warning during scripts but still exits 0. The Dockerfile uses Node 24.
- Tailwind v4 via the Vite plugin; there is no `tailwind.config.*`. Theme tokens and design variables live in `app/app.css` (`@theme`, `:root`, `.dark`).
- shadcn is configured in `components.json` (style `base-sera`). Components in `app/components/ui/` use `@base-ui/react` primitives, not Radix, and import `cn` from the `cn` package. App imports use `@/*` -> `app/*`.
- `frontend/README.md` is the stock React Router template (npm instructions). It is stale — the repo tracks `bun.lock`, so use bun, not npm.
- For React Router behavior, read `frontend/.agents/skills/react-router/SKILL.md` and the installed version-matched docs under `frontend/node_modules/react-router/docs/`.

## Backend (`backend/`)

- Bun + TypeScript, entry `backend/index.ts`. Commands: `bun install`, `bun run index.ts`, `bun run typecheck` (which is `bun check`). Use `bun fmt` to format.

## Gotchas

- `frontend/` tracks `bun.lock`, but `frontend/Dockerfile` runs `npm ci` against a missing `package-lock.json`; the Docker build will fail until the lockfile or Dockerfile is reconciled.
- No test suite, lint, or CI is configured. Verification is `bun run typecheck`, plus `bun run build` for the frontend.
