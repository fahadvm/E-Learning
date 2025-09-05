// middlewares/errorHandler.ts
import {  Response,  } from 'express';
export function errorHandler(
  err: any,
  res: Response,
) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.log('this error message from errorHandler:',message,status);
   res.status(status).json({ ok: false, message });
}
