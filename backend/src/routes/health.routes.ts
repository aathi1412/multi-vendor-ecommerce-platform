import { Router } from "express";
import type { Request, Response } from "express";

const healthRoutes = Router();

healthRoutes.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default healthRoutes;
