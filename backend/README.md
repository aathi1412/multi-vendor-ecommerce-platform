# Backend — Ecommerce API

Express REST API for the multi-vendor ecommerce platform.

## Requirements

- [Bun](https://bun.com) 1.4+

## Setup

```bash
bun install
cp .env.example .env   # adjust values as needed
```

## Development

```bash
bun run dev
```

Starts the API at **http://localhost:5000** with hot reload via `bun --watch`
(the server restarts automatically when files in `src/` change).

## Scripts

| Script | Description |
| --- | --- |
| `bun run dev` | Start with hot reload |
| `bun run build` | Compile TypeScript to `dist/` |
| `bun run start` | Run the compiled build (`node dist/server.js`) |
| `bun run typecheck` | Type check without emitting |

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | API metadata |
| `GET` | `/api/health` | Health check (`status`, `uptime`, `timestamp`) |

## Structure

```
src/
├── server.ts                 # Entry point: listen, graceful shutdown
├── app.ts                    # Express app, middleware, route mounting
├── routes/                   # Per-resource routers
└── middlewares/              # Shared middleware (errors, auth, etc.)
```

Local imports use explicit `.js` extensions (required for Vercel deployment).
