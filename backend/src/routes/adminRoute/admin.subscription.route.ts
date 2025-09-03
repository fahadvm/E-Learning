import { Router } from 'express';
import container from '../../core/di/container';
import { AdminSubscriptionPlanController } from '../../controllers/admin/admin.subscription.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { TYPES } from '../../core/di/types';

const subscriptionRouter = Router();
const adminSubscriptionPlanCtrl = container.get<AdminSubscriptionPlanController>(TYPES.AdminSubscriptionPlanController);

subscriptionRouter
  .route('/')
  .get(asyncHandler(adminSubscriptionPlanCtrl.getAllPlans.bind(adminSubscriptionPlanCtrl)))
  .post(asyncHandler(adminSubscriptionPlanCtrl.createPlan.bind(adminSubscriptionPlanCtrl)));

subscriptionRouter
  .route('/:planId')
  .get(asyncHandler(adminSubscriptionPlanCtrl.getPlanById.bind(adminSubscriptionPlanCtrl)))
  .put(asyncHandler(adminSubscriptionPlanCtrl.updatePlan.bind(adminSubscriptionPlanCtrl)))
  .delete(asyncHandler(adminSubscriptionPlanCtrl.deletePlan.bind(adminSubscriptionPlanCtrl)));

export default subscriptionRouter;
