"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongoose_1 = __importStar(require("mongoose"));
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
    update(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Order_1.OrderModel.findByIdAndUpdate(id, update, { new: true });
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
                .populate({
                path: 'courses',
                model: 'Course',
                populate: {
                    path: 'teacherId',
                    model: 'Teacher',
                },
            })
                .exec();
        });
    }
    getOrderedCourseIds(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield Order_1.OrderModel.find({
                studentId,
                status: 'paid',
            })
                .select('courses')
                .exec();
            const courseIds = orders.flatMap((order) => order.courses.map((c) => {
                var _a;
                if (c instanceof mongoose_1.Types.ObjectId)
                    return c.toString();
                if (typeof c === 'object' && '_id' in c)
                    return ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                return String(c);
            }));
            return courseIds;
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
    getOrderDetailsByrazorpayOrderId(studentId, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield Order_1.OrderModel.findOne({ studentId, razorpayOrderId: orderId, status: 'paid' })
                .populate({
                path: 'studentId',
                select: 'name email',
            })
                .populate({
                path: 'courses',
                select: 'coverImage title totalDuration teacherId price',
                populate: {
                    path: 'teacherId',
                    select: 'name',
                },
            })
                .lean();
            return order;
        });
    }
    findOrdersByStudent(studentId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            // ensure valid ObjectId filter
            const filter = {};
            if (mongoose_1.default.Types.ObjectId.isValid(studentId)) {
                filter.studentId = new mongoose_1.default.Types.ObjectId(studentId);
            }
            else {
                // no orders if invalid id (caller should validate; defensive)
                return { orders: [], total: 0 };
            }
            const [total, orders] = yield Promise.all([
                Order_1.OrderModel.countDocuments(filter),
                Order_1.OrderModel.find(filter)
                    .populate('courses') // will populate course docs
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
            ]);
            return { orders: orders, total };
        });
    }
    getEnrolmentAnalytics(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseObjectId = new mongoose_1.default.Types.ObjectId(courseId);
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const result = yield Order_1.OrderModel.aggregate([
                {
                    $match: {
                        courses: { $in: [courseObjectId] },
                        status: 'paid',
                        createdAt: { $gte: sixMonthsAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { '_id.year': 1, '_id.month': 1 }
                }
            ]);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return result.map(item => ({
                month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
                count: item.count
            }));
        });
    }
};
exports.OrderRepository = OrderRepository;
exports.OrderRepository = OrderRepository = __decorate([
    (0, inversify_1.injectable)()
], OrderRepository);
