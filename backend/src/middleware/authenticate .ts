import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/ResANDError';


export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.token;
  if (!accessToken) {
    sendResponse(res, 401, '', true);
    console.log('req.cookies is now:', req.cookies);
    return;
  }
  console.log('decoding:',accessToken);

  if (!req.user) {
    sendResponse(res, 401, 'Unauthorized', true);
    return;
  }

  next();
};
