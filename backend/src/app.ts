import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");

const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    name: "Ecommerce API",
    version: "1.0.0",
    status: "running",
  });
});

app.use("/api/health", healthRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
