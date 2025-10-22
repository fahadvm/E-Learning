import { Response } from 'express';
import logger from './logger';

export function throwErrorWithRes(res: Response, message: string, statusCode = 400): never {
   logger.error('Throwing error:', message);
  res.status(statusCode).json({ message });
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  throw error;
}

export function throwError(message: string, statusCode = 400): never {
   logger.error('Throwing error:', message);
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  throw error;
}

export function sendResponse<T = unknown>(
  res: Response,
  status: number,
  message: string,
  ok: boolean,
  data?: T
) {
   logger.info(message);
  res.status(status).json({ ok, message, data });
}

export function handleControllerError(res: Response, error: unknown, defaultStatus = 400): void {
  const err = error as Error & { statusCode?: number };
  const statusCode = err.statusCode || defaultStatus;
   logger.error(err.message);
  sendResponse(res, statusCode, err.message, false);
}
