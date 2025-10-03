"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSubscriptionPlanDto = void 0;
const adminSubscriptionPlanDto = (plan) => ({
    _id: plan._id.toString(),
    name: plan.name,
    price: plan.price,
    planFor: plan.planFor,
    description: plan.description,
    features: plan.features,
    popular: plan.popular || false,
});
exports.adminSubscriptionPlanDto = adminSubscriptionPlanDto;
