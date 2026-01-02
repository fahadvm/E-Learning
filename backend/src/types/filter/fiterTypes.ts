import { ICourse } from '../../models/Course';
import { IStudent } from '../../models/Student';
import mongoose from 'mongoose';

export interface IBookingFilter {
  teacherId: string;
  status?: string;
}

export interface RazorpayVerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CourseQuery {
  title?: { $regex: string; $options: string };
  category?: string;
  level?: string;
  language?: string;
  isBlocked?: boolean;
  isPublished?: boolean;
}

export interface EmployeeSummary {
  _id: string;
  name: string;
  email: string;
  position: string;
}

export type OtpPurpose = 'signup' | 'change-email' | 'forgot-password';

export interface OtpQuery {
  email: string;
  purpose?: OtpPurpose;
  expiresAt?: { $gt: Date };
}

export type RazorpayOrderResponse = {
  id: string;
  entity: string;
  amount: number | string;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt?: string;
  offer_id?: string | null;
  status: string;
  attempts: number;
  created_at: number;
};
import { AuthRequest } from '../AuthenticatedRequest';

export interface CreateCourseRequest extends AuthRequest {
  body: {
    title: string;
    subtitle?: string;
    description: string;
    category: string;
    level: string;
    language: string;
    price?: string | number;
    learningOutcomes?: string;
    isTechnicalCourse: boolean
    requirements?: string;
    modules?: string;
    totalDuration?: number | string;
    isPublished?: string;
  };
  files?: Express.Multer.File[];
}


export interface IAvailableSlot {
  date: string;
  day: string;
  start: string;
  end: string;
  slot: Date;
}


export interface ITeacherSlot {
  _id: string | '';
  date: string;
  day: string;
  slot: {
    start: string;
    end: string;
  };
  status: 'available' | 'pending' | 'booked' | 'cancelled' | 'rescheduled' | 'failed';
  student?: mongoose.Types.ObjectId | IStudent;
  course?: mongoose.Types.ObjectId | ICourse;
  callId: string | undefined
}
export interface TemporaryCompanyData {
  name: string;
  password: string;
  createdAt: number;
}

