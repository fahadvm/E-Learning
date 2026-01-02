import { Request, Response } from 'express';

export interface IStudentTeacherReviewController {
  addReview(req: Request, res: Response): Promise<void>;
  updateReview(req: Request, res: Response): Promise<void>;
  deleteReview(req: Request, res: Response): Promise<void>;
  getTeacherReviews(req: Request, res: Response): Promise<void>;
  getRatingStats(req: Request, res: Response): Promise<void>;
}
