import { Request, Response, NextFunction } from 'express';
import {  clearTokens, verifyAccessToken } from '../utils/JWTtoken';
import { sendResponse } from '../utils/ResANDError';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.token;
  if (!accessToken) {
     sendResponse(res,401,'',true);
     return;
  }

  const decoded = verifyAccessToken(accessToken);
  
  if (decoded?.id&&decoded.role==='user') {
    next();
    return;
  }
   clearTokens(res);
};