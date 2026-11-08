import type { NextFunction, Request, Response } from "express";

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

type HttpError = Error & {
  status?: number;
  statusCode?: number;
  type?: string;
};

export function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = err.status ?? err.statusCode ?? 500;
  const isProduction = process.env.NODE_ENV === "production";

  // Body-parser errors (malformed JSON) carry status 400 and an exposed message.
  const message =
    status >= 500 ? "Internal server error" : err.message || "Request failed";

  if (status >= 500) {
    console.error("[error]", err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
