"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanRepository = void 0;
// src/repositories/admin/SubscriptionPlanRepository.ts
const inversify_1 = require("inversify");
const subscriptionPlan_1 = require("../models/subscriptionPlan");
const StudentSubscription_1 = require("../models/StudentSubscription");
const Student_1 = require("../models/Student");
let SubscriptionPlanRepository = class SubscriptionPlanRepository {
    create(plan) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionPlan_1.SubscriptionPlan.create(plan);
        });
    }
    findAll(skip, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = search
                ? { name: { $regex: search, $options: 'i' } }
                : {};
            return yield subscriptionPlan_1.SubscriptionPlan.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
        });
    }
    countAll(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = search
                ? { name: { $regex: search, $options: 'i' } }
                : {};
            return subscriptionPlan_1.SubscriptionPlan.countDocuments(filter).exec();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionPlan_1.SubscriptionPlan.findById(id);
        });
    }
    update(id, plan) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionPlan_1.SubscriptionPlan.findByIdAndUpdate(id, plan, { new: true });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield subscriptionPlan_1.SubscriptionPlan.findByIdAndDelete(id);
        });
    }
    findAllForStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionPlan_1.SubscriptionPlan.find({ planFor: 'Student' });
        });
    }
    findAllForCompany() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionPlan_1.SubscriptionPlan.find({ planFor: 'Company' });
        });
    }
    findAllPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionPlan_1.SubscriptionPlan.find({ isActive: true });
        });
    }
    findPlanById(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield subscriptionPlan_1.SubscriptionPlan.findById(planId);
        });
    }
    saveStudentSubscription(studentId, planId, orderId, paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield StudentSubscription_1.StudentSubscription.create({
                studentId,
                planId,
                orderId,
                paymentId,
                status: 'pending',
            });
        });
    }
    updatePaymentStatus(studentId, orderId, status, paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield Student_1.Student.findByIdAndUpdate(studentId, { isPremium: true });
            return yield StudentSubscription_1.StudentSubscription.findOneAndUpdate({ orderId }, { status, paymentId }, { new: true });
        });
    }
    findActiveSubscription(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield StudentSubscription_1.StudentSubscription.findOne({ studentId, status: 'active' }).populate("planId");
        });
    }
};
exports.SubscriptionPlanRepository = SubscriptionPlanRepository;
exports.SubscriptionPlanRepository = SubscriptionPlanRepository = __decorate([
    (0, inversify_1.injectable)()
], SubscriptionPlanRepository);
