// src/controllers/student/student.purchase.controller.ts
import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IStudentPurchaseService } from '../../core/interfaces/services/student/IStudentPurchaseService';
import { IStudentPurchaseController } from '../../core/interfaces/controllers/student/IStudentPurchaseController';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { generateInvoicePDF } from '../../utils/pdfGenerator';




@injectable()
export class StudentPurchaseController implements IStudentPurchaseController {
  constructor(
    @inject(TYPES.StudentPurchaseService)
    private readonly _PurchaseService: IStudentPurchaseService
  ) { }

  createOrder = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { courses, amount } = req.body;
    if (!courses || !amount)
      throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);

    const order = await this._PurchaseService.createOrder(studentId, courses, amount);
    return sendResponse(res, STATUS_CODES.CREATED, MESSAGES.ORDER_CREATED_SUCCESSFULLY, true, order);
  };

  verifyPayment = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) {
      throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    }
    const verified = await this._PurchaseService.verifyPayment(req.body, studentId);
    return verified.success
      ? sendResponse(res, STATUS_CODES.OK, MESSAGES.PAYMENT_VERIFIED_SUCCESSFULLY, true, verified)
      : sendResponse(res, STATUS_CODES.BAD_REQUEST, MESSAGES.PAYMENT_VERIFICATION_FAILED, false, verified);
  };


  getMyCourses = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const courses = await this._PurchaseService.getPurchasedCourses(studentId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, courses);
  };

  getMyCourseDetails = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    const courseId = req.params.courseId;
    if (!courseId || !studentId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.NOT_FOUND);
    const course = await this._PurchaseService.getPurchasedCourseDetails(courseId, studentId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, course);
  };
  public async getPurchasedCourseIds(req: AuthRequest, res: Response) {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const courseIds = await this._PurchaseService.getPurchasedCourseIds(studentId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_IDS_FETCHED, true, courseIds);
  }

  getOrderDetails = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED);
    const { razorpayOrderId } = req.params;

    const order = await this._PurchaseService.getOrderDetails(studentId, razorpayOrderId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.ORDER_FETCHED_SUCCESSFULLY, true, order);
  };

  getPurchaseHistory = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await this._PurchaseService.getPurchaseHistory(studentId, page, limit);
    return sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.PURCHASE_HISTORY_FETCHED,
      true,
      result
    );
  };

  downloadReceipt = async (req: AuthRequest, res: Response)=>{
  const studentId = req.user?.id;
  if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
  const { razorpayOrderId } = req.params;

  const order = await this._PurchaseService.getOrderDetails(studentId, razorpayOrderId);

  if (!order) {
    throwError(MESSAGES.ORDER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  }

  const pdfBuffer = await generateInvoicePDF(order);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.razorpayOrderId}.pdf`);
  res.setHeader('Content-Length', pdfBuffer.length);

  res.send(pdfBuffer);

};
}
