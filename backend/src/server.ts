import type { Server } from "node:http";

import app from "./app.js";

const DEFAULT_PORT = 5000;
const parsedPort = Number(process.env.PORT);
const PORT =
  Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort < 65536
    ? parsedPort
    : DEFAULT_PORT;

const server: Server = app.listen(PORT, () => {
  const env = process.env.NODE_ENV ?? "development";
  console.log(`Server running on http://localhost:${PORT} [${env}]`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other process or set a different PORT.`,
    );
  } else {
    console.error("[startup error]", error);
  }
  process.exit(1);
});

function shutdown(signal: "SIGINT" | "SIGTERM"): void {
  console.log(`\n${signal} received. Closing server...`);

  server.close((error) => {
    if (error) {
      console.error("[shutdown error]", error);
      process.exit(1);
    }
    process.exit(0);
  });

  // Don't hang forever if open connections refuse to close.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
