import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/ResANDError';
import logger from '../utils/logger';


export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.token;
  if (!accessToken) {
    sendResponse(res, 401, '', true);
     logger.info('req.cookies is now:', req.cookies);
    return;
  }
   logger.info('decoding:',accessToken);

  if (!req.user) {
    sendResponse(res, 401, 'Unauthorized', true);
    return;
  }

  next();
};
