import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { asyncHandler } from '../../middleware/asyncHandler';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { CompanyPurchaseController } from '../../controllers/company/company.purchase.controller';
import { CompanyCourseController } from '../../controllers/company/company.course.controller';

const router = Router();
const companyPurchaseCtrl = container.get<CompanyPurchaseController>(TYPES.CompanyPurchaseController);
const companyCourseController = container.get<CompanyCourseController>(TYPES.CompanyCourseController);

router.post('/checkout-session', authMiddleware('company'), asyncHandler(companyPurchaseCtrl.createCheckoutSession.bind(companyPurchaseCtrl)));
router.post('/verify-payment', authMiddleware('company'), asyncHandler(companyPurchaseCtrl.verifyPayment.bind(companyPurchaseCtrl)));
router.get('/receipt/:orderId', authMiddleware('company'), asyncHandler(companyPurchaseCtrl.downloadReceipt.bind(companyPurchaseCtrl)));
router.get('/orders', authMiddleware('company'), asyncHandler(companyPurchaseCtrl.getPurchasedCourses.bind(companyPurchaseCtrl)));
router.get('/entrollments', authMiddleware('company'), asyncHandler(companyCourseController.getMyCourses.bind(companyCourseController)));
router.get('/entrollments-course/ids', authMiddleware('company'), asyncHandler(companyCourseController.getMyCoursesIds.bind(companyCourseController)));
router.get('/entrollments/:courseId', authMiddleware('company'), asyncHandler(companyCourseController.getMyCourseDetails.bind(companyCourseController)));


export default router;
