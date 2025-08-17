// import { Router } from 'express';
// import container from '../../core/di/container';
// import { SubscriptionPlanController } from '../../controllers/admin/SubscriptionPlanController';
// import { asyncHandler } from '../../middleware/asyncHandler';

// const subscriptionRouter = Router();
// const subscriptionPlanCtrl = container.get<SubscriptionPlanController>('SubscriptionPlanController');

// subscriptionRouter
//   .route('/')
//   .get(asyncHandler(subscriptionPlanCtrl.getAll.bind(subscriptionPlanCtrl)))
//   .post(asyncHandler(subscriptionPlanCtrl.create.bind(subscriptionPlanCtrl)));

// subscriptionRouter
//   .route('/:planId')
//   .get(asyncHandler(subscriptionPlanCtrl.getById.bind(subscriptionPlanCtrl)))
//   .put(asyncHandler(subscriptionPlanCtrl.update.bind(subscriptionPlanCtrl)))
//   .delete(asyncHandler(subscriptionPlanCtrl.delete.bind(subscriptionPlanCtrl)));

// export default subscriptionRouter;
