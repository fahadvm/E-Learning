
import { Request, Response, NextFunction } from 'express';
import {  verifyAccessToken } from '../utils/JWTtoken';
import { throwError } from '../utils/ResANDError';
import { STATUS_CODES } from '../utils/HttpStatuscodes';

export const authMiddleware = (role: 'student' | 'teacher' | 'company' | 'Admin' | 'employee') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token ;
    // console.log(' authMiddleware token is :', token);

    if (!token) {
      return throwError('No token provided', STATUS_CODES.UNAUTHORIZED);
    }

    try {
      const decoded = verifyAccessToken(token);
          // console.log(' authMiddleware decoded is :', decoded);


      if (decoded?.role !== role) {
        return throwError('Unauthorized role access', STATUS_CODES.FORBIDDEN);
      }

      req.user = {
        id: decoded?.id,
        role: decoded?.role,
      };
      // console.log('req.user from middleware:' ,req.user);

      next();
    } catch {
      return throwError('Invalid or expired token', STATUS_CODES.UNAUTHORIZED);
      
    }
  };
};
