
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/JWTtoken';
import { throwError } from '../utils/ResANDError';
import { STATUS_CODES } from '../utils/HttpStatuscodes';
import { Student } from '../models/Student';
import { Teacher } from '../models/Teacher';
import { Company } from '../models/Company';
import { Employee } from '../models/Employee';
import { MESSAGES } from '../utils/ResponseMessages';

export const authMiddleware = (role: 'student' | 'teacher' | 'company' | 'admin' | 'employee') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
      return throwError('No token provided', STATUS_CODES.UNAUTHORIZED);
    }

    try {
      const decoded = verifyAccessToken(token);

      if (decoded?.role !== role) {
        return throwError('Unauthorized role access', STATUS_CODES.FORBIDDEN);
      }

      const userId = decoded?.id;
      if (!userId) return throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.FORBIDDEN);

      let isBlocked = false;

      // Global blocking check
      if (role === 'student') {
        const student = await Student.findById(userId).select('isBlocked');
        isBlocked = !!student?.isBlocked;
      } else if (role === 'teacher') {
        const teacher = await Teacher.findById(userId).select('isBlocked');
        isBlocked = !!teacher?.isBlocked;
      } else if (role === 'company') {
        const company = await Company.findById(userId).select('isBlocked');
        isBlocked = !!company?.isBlocked;
      } else if (role === 'employee') {
        const employee = await Employee.findById(userId).select('isBlocked');
        isBlocked = !!employee?.isBlocked;
      }

      if (isBlocked) {
        // Clear cookie if user is blocked
        res.clearCookie('token');
        return throwError('Your account has been blocked by admin', STATUS_CODES.FORBIDDEN);
      }

      req.user = {
        id: userId,
        role: decoded?.role,
      };

      next();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'statusCode' in err) {
        return next(err);
      }
      return throwError('Invalid or expired token', STATUS_CODES.UNAUTHORIZED);
    }
  };
};
