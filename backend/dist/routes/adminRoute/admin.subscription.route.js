"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const subscriptionRouter = (0, express_1.Router)();
const adminSubscriptionPlanCtrl = container_1.default.get(types_1.TYPES.AdminSubscriptionPlanController);
subscriptionRouter
    .route('/')
    .get((0, asyncHandler_1.asyncHandler)(adminSubscriptionPlanCtrl.getAllPlans.bind(adminSubscriptionPlanCtrl)))
    .post((0, asyncHandler_1.asyncHandler)(adminSubscriptionPlanCtrl.createPlan.bind(adminSubscriptionPlanCtrl)));
subscriptionRouter
    .route('/:planId')
    .get((0, asyncHandler_1.asyncHandler)(adminSubscriptionPlanCtrl.getPlanById.bind(adminSubscriptionPlanCtrl)))
    .put((0, asyncHandler_1.asyncHandler)(adminSubscriptionPlanCtrl.updatePlan.bind(adminSubscriptionPlanCtrl)))
    .delete((0, asyncHandler_1.asyncHandler)(adminSubscriptionPlanCtrl.deletePlan.bind(adminSubscriptionPlanCtrl)));
exports.default = subscriptionRouter;
