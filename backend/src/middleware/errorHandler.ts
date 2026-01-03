import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  logger.error(`Error from errorHandler: ${message}${ status}`);

  res.status(status).json({ ok: false, message });
}
