// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {

    console.log("middleware is working")
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.log("this error message from errorHandler",message)

  console.error("Error caught:", message);

  res.status(status).json({ message });
}
