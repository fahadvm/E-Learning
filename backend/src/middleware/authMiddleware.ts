
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/JWTtoken';
import { throwError } from '../utils/ResANDError';
import { STATUS_CODES } from '../utils/HttpStatuscodes';
import { Student } from '../models/Student';
import { MESSAGES } from '../utils/ResponseMessages';

export const authMiddleware = (role: 'student' | 'teacher' | 'company' | 'admin' | 'employee') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;
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

      if (role === 'student') {

        if (!decoded?.id) return throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.FORBIDDEN);
        const student = await Student.findById(decoded?.id).select('isBlocked');

        if (student?.isBlocked) {
          console.log("blocked is working now ")
          return throwError('Your account has been blocked by admin', STATUS_CODES.FORBIDDEN);
        }
      }

      req.user = {
        id: decoded?.id,
        role: decoded?.role,
      };

      next();
    } catch (err: any) {
      {
        if (err.statusCode) {
          return next(err);
        }
        return throwError('Invalid or expired token', STATUS_CODES.UNAUTHORIZED);

      }
    }
  };
};
