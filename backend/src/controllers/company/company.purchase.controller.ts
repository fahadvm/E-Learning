import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { ICompanyPurchaseService } from '../../core/interfaces/services/company/ICompanyPurchaseService';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { ICompanyPurchaseController } from '../../core/interfaces/controllers/company/ICompanyPurchaseController';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { CompanyOrderModel } from '../../models/CompanyOrder';
import PDFDocument from "pdfkit";

@injectable()
export class CompanyPurchaseController implements ICompanyPurchaseController {
    constructor(
        @inject(TYPES.CompanyPurchaseService)
        private _purchaseService: ICompanyPurchaseService
    ) { }

    async createCheckoutSession(req: AuthRequest, res: Response) {
        console
        const companyId = req.user?.id;

        if (!companyId) {
            throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }

        const session = await this._purchaseService.createCheckoutSession(companyId);
        const data = { url: session.url };
        sendResponse(res, STATUS_CODES.OK, MESSAGES.PAYMENT_PAID_SUCCESSFULLY, true, data);
    }

    async verifyPayment(req: AuthRequest, res: Response) {
        const { sessionId } = req.body;
        const companyId = req.user?.id;

        if (!sessionId || !companyId) {
            throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);
        }

        const result = await this._purchaseService.verifyPayment(sessionId, companyId);

        if (result.success) {
            sendResponse(res, STATUS_CODES.OK, MESSAGES.PAYMENT_VERIFIED_SUCCESSFULLY, true, result);
        } else {
            sendResponse(res, STATUS_CODES.OK, MESSAGES.PAYMENT_VERIFICATION_FAILED, true, result);
        }
    }

    // GET /api/company/orders/:orderId/receipt
    async downloadReceipt(req: AuthRequest, res: Response) {
        const { orderId } = req.params;

        const order = await CompanyOrderModel.findById(orderId).populate(
            "purchasedCourses.courseId",
            "title price"
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Create PDF
        const doc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=receipt_${orderId}.pdf`
        );

        // Pipe BEFORE writing
        doc.pipe(res);

        // Content
        doc.fontSize(20).text("Payment Receipt", { align: "center" });
        doc.moveDown();

        doc.fontSize(12).text(`Order ID: ${orderId}`);
        doc.text(`Total Paid: ₹${order.amount}`);
        doc.moveDown();

        doc.text("Purchased Courses:");
        order.purchasedCourses.forEach((item: any) => {
            const course = item.courseId;
            doc.text(`• ${course.title} — ₹${item.price} (${item.seats} seat${item.seats > 1 ? 's' : ''})`);
        });

        doc.end();
    }

    async getPurchasedCourses(req: AuthRequest, res: Response) {
        const companyId = req.user?.id;

        if (!companyId) {
            throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }

        const courses = await this._purchaseService.getPurchasedCourses(companyId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, courses);
    }

    async getPurchasedCourseIds(req: AuthRequest, res: Response) {
        const companyId = req.user?.id;

        if (!companyId) {
            throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }

        const courseIds = await this._purchaseService.getMycoursesIdsById(companyId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, courseIds);
    }
}
