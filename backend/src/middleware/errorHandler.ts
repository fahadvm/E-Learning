// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {

  const status = err.statusCode || 500;
  
  const message = err.message || 'Internal Server Error';
  console.log('this error message from errorHandler:',message,status);


   res.status(status).json({ ok: false, message });
}
