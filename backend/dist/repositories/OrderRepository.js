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
exports.OrderRepository = void 0;
const Order_1 = require("../models/Order");
const inversify_1 = require("inversify");
let OrderRepository = class OrderRepository {
    create(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOrder = new Order_1.OrderModel(order);
            return yield newOrder.save();
        });
    }
    findByRazorpayOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Order_1.OrderModel.findOne({ razorpayOrderId: orderId });
        });
    }
    updateStatus(orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Order_1.OrderModel.findOneAndUpdate({ razorpayOrderId: orderId }, { status }, { new: true });
        });
    }
    getOrdersByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Order_1.OrderModel.find({
                studentId,
                status: 'paid',
            })
                .populate('courses')
                .exec();
        });
    }
    getStudentOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return Order_1.OrderModel.find()
                .populate('studentId', 'name email')
                .populate('courses', 'title')
                .sort({ createdAt: -1 });
        });
    }
};
exports.OrderRepository = OrderRepository;
exports.OrderRepository = OrderRepository = __decorate([
    (0, inversify_1.injectable)()
], OrderRepository);
