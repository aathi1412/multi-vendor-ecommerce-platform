# Backend Setup — Express + Bun Watch

## Goal

Stand up the Express REST API in `backend/` as the foundation for the platform, and configure **hot reload via `bun --watch`** for development. The server must start cleanly on **port 5000** with a health endpoint we can verify.

## Decisions / assumptions

- **Runtime**: **Bun** is both the runtime and the watcher (per `AGENTS.md`): `bun --watch src/server.ts`. No Nodemon dependency.
- **Structure**: follow `AGENTS.md` → entry point is `backend/src/server.ts` (not the scaffold's `backend/index.ts`). Delete the empty `index.ts` scaffold once `src/server.ts` exists.
- **Scope**: only the Express bootstrap. No database, auth, models, or business routes yet — those come in later prompts.
- **Imports**: all local backend imports will use explicit `.js` extensions (Vercel requirement).
- **Port**: `process.env.PORT ?? 5000`. Bun auto-loads `.env`, so no `dotenv` dependency.

## Files

| File | Purpose |
| --- | --- |
| `backend/src/server.ts` | Entry point: create app, `app.listen(PORT)`, log the URL, handle `SIGINT`/`SIGTERM` and startup errors. |
| `backend/src/app.ts` | Builds and exports the Express `app` (so it can be imported by tests/Vercel later without listening). |
| `backend/src/routes/health.routes.ts` | `GET /api/health` → `{ status: "ok", uptime, timestamp }`. |
| `backend/src/middlewares/error.middleware.ts` | `notFound` (JSON 404) + `errorHandler` (JSON 500, stack only when `NODE_ENV !== "production"`). |
| `backend/.env.example` | `PORT=5000`, `NODE_ENV=development`, `FRONTEND_URL=http://localhost:5173`. |
| `backend/package.json` | Updated scripts + dependencies (below). |
| `backend/tsconfig.json` | Node-compatible emit config for deployment (`dist/`), keeps strict flags. |
| `backend/README.md` | Replace scaffold text with dev/build/start instructions. |

## Dependencies

- `express`
- `cors` (frontend runs on a different origin: `http://localhost:5173`)
- Dev: `typescript`, `@types/express`, `@types/cors`, `@types/node`

## Scripts

```jsonc
{
  "dev": "bun --watch src/server.ts",
  "build": "tsc -p tsconfig.json",
  "start": "node dist/server.js",
  "typecheck": "tsc --noEmit"
}
```

## Endpoints

| Method | Path | Response |
| --- | --- | --- |
| `GET` | `/` | `{ name: "Ecommerce API", version: "1.0.0", status: "running" }` |
| `GET` | `/api/health` | `200 { status: "ok", uptime, timestamp }` |
| `*` | anything else | `404 { success: false, message: "Route not found" }` |

## Edge cases

- Invalid `PORT` → fall back to `5000` instead of crashing.
- `EADDRINUSE` on startup → log a clear message and exit `1`.
- Errors thrown in routes → caught by the central error handler, never leak raw stack in production.
- JSON body parse errors → returned as `400` by the error handler.
- `SIGINT` / `SIGTERM` → close the HTTP server gracefully (important for watch restarts).

## Done when

1. `cd backend && bun run dev` logs `Server running on http://localhost:5000` and restarts on file save.
2. `curl http://localhost:5000/api/health` returns `200` with `status: "ok"`.
3. An unknown route returns the JSON `404`.
4. `bun run typecheck` passes with zero errors.
5. `bun run build` emits `dist/server.js` (verifies the `.js` import convention actually works).
