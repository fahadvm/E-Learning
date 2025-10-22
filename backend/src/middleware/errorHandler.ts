import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction 
) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
   console.error('Error from errorHandler:', message, status);

  res.status(status).json({ ok: false, message });
}
