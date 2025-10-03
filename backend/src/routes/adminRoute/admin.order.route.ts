// src/routes/admin/adminOrder.routes.ts
import { Router } from "express";
import container from "../../core/di/container";
import { TYPES } from "../../core/di/types";
import { AdminOrderController } from "../../controllers/admin/admin.order.controller";
import { asyncHandler } from "../../middleware/asyncHandler";

const router = Router();
const orderCtrl = container.get<AdminOrderController>(TYPES.AdminOrderController);

router.get("/company", asyncHandler(orderCtrl.getCompanyOrders.bind(orderCtrl)));
router.get("/student", asyncHandler(orderCtrl.getStudentOrders.bind(orderCtrl)));

export default router;
