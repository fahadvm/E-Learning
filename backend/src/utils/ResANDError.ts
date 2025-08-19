import { Response } from 'express';

export function throwErrorWithRes(res: Response, message: string, statusCode = 400): never {
  console.error('Throwing error:', message);
  res.status(statusCode).json({ message }); 
  const error = new Error(message);
  (error as any).statusCode = statusCode; 
  throw error;
}
export function throwError( message: string, statusCode = 400): never {
  console.error('Throwing error:', message);
  const error = new Error(message);
  (error as any).statusCode = statusCode; 
  throw error;
}
 
export function sendResponse(res: Response,status: number, message: string,  ok: boolean,data?:any) {
    console.error(message)
    res.status(status).json({ ok, message ,data}); 
}
export function handleControllerError(res: Response, error: unknown, defaultStatus = 400): void {
  const err = error as any;
  const statusCode = err.statusCode || defaultStatus;
  console.error(err.message);
  sendResponse(res, statusCode, err.message, false);
}