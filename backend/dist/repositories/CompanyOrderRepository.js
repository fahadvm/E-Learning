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
exports.CompanyOrderRepository = void 0;
const CompanyOrder_1 = require("../models/CompanyOrder");
const inversify_1 = require("inversify");
let CompanyOrderRepository = class CompanyOrderRepository {
    create(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOrder = new CompanyOrder_1.CompanyOrderModel(order);
            return yield newOrder.save();
        });
    }
    findByStripeSessionId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CompanyOrder_1.CompanyOrderModel.findOne({ stripeSessionId: orderId });
        });
    }
    updateStatus(orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CompanyOrder_1.CompanyOrderModel.findOneAndUpdate({ stripeSessionId: orderId }, { status }, { new: true });
        });
    }
    getOrdersByCompanyId(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return CompanyOrder_1.CompanyOrderModel.find({
                companyId,
                status: 'paid',
            })
                .populate('courses')
                .exec();
        });
    }
    getOrdersById(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return CompanyOrder_1.CompanyOrderModel.find({
                companyId,
                status: 'paid',
            });
        });
    }
    getCompanyOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return CompanyOrder_1.CompanyOrderModel.find()
                .populate('companyId', 'name email')
                .populate('courses', 'title')
                .sort({ createdAt: -1 });
        });
    }
};
exports.CompanyOrderRepository = CompanyOrderRepository;
exports.CompanyOrderRepository = CompanyOrderRepository = __decorate([
    (0, inversify_1.injectable)()
], CompanyOrderRepository);
