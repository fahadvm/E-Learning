"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherDashboardService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const mongoose_1 = __importDefault(require("mongoose"));
// Direct model access for aggregations
const Booking_1 = require("../../models/Booking");
const Transaction_1 = require("../../models/Transaction");
const Order_1 = require("../../models/Order");
const CompanyOrder_1 = require("../../models/CompanyOrder");
let TeacherDashboardService = class TeacherDashboardService {
    constructor(_courseRepository, _walletRepo) {
        this._courseRepository = _courseRepository;
        this._walletRepo = _walletRepo;
    }
    getDashboardStats(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tId = new mongoose_1.default.Types.ObjectId(teacherId);
            // 1. Total Courses
            const courses = yield this._courseRepository.findByTeacherId(teacherId);
            const totalCourses = courses.length;
            // 2. Active Students (Unique students who bought courses)
            const studentStats = yield Order_1.OrderModel.aggregate([
                { $match: { status: "paid" } },
                { $unwind: "$courses" },
                {
                    $lookup: {
                        from: "courses",
                        localField: "courses",
                        foreignField: "_id",
                        as: "courseDetails"
                    }
                },
                { $unwind: "$courseDetails" },
                { $match: { "courseDetails.teacherId": tId } },
                { $group: { _id: null, uniqueStudents: { $addToSet: "$studentId" } } }
            ]);
            const activeStudents = studentStats.length > 0 ? studentStats[0].uniqueStudents.length : 0;
            // 3. Active Companies
            const companyStats = yield CompanyOrder_1.CompanyOrderModel.aggregate([
                { $match: { status: "paid" } },
                { $unwind: "$purchasedCourses" },
                {
                    $lookup: {
                        from: "courses",
                        localField: "purchasedCourses.courseId",
                        foreignField: "_id",
                        as: "courseDetails"
                    }
                },
                { $unwind: "$courseDetails" },
                { $match: { "courseDetails.teacherId": tId } },
                { $group: { _id: null, uniqueCompanies: { $addToSet: "$companyId" } } }
            ]);
            const activeCompanies = companyStats.length > 0 ? companyStats[0].uniqueCompanies.length : 0;
            // 4. Earnings
            const wallet = yield this._walletRepo.findByTeacherId(teacherId);
            const totalEarnings = wallet ? wallet.totalEarned : 0;
            // Monthly Earnings (Current Month)
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthlyStats = yield Transaction_1.Transaction.aggregate([
                {
                    $match: {
                        teacherId: tId,
                        type: "TEACHER_EARNING",
                        createdAt: { $gte: startOfMonth }
                    }
                },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);
            const monthlyEarnings = monthlyStats.length > 0 ? monthlyStats[0].total : 0;
            return {
                activeStudents,
                totalCourses,
                activeCompanies,
                totalEarnings,
                monthlyEarnings
            };
        });
    }
    getTopCourses(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tId = new mongoose_1.default.Types.ObjectId(teacherId);
            // Aggregate from Transactions to get earnings per course
            // Or aggregate from Orders. 
            // Using Transactions is better for "Earnings" per course if we record courseId in transaction.
            // The Transaction model has `courseId`.
            const topCourses = yield Transaction_1.Transaction.aggregate([
                {
                    $match: {
                        teacherId: tId,
                        type: "TEACHER_EARNING",
                        courseId: { $exists: true }
                    }
                },
                {
                    $group: {
                        _id: "$courseId",
                        earnings: { $sum: "$amount" }
                    }
                },
                { $sort: { earnings: -1 } },
                { $limit: 3 },
                {
                    $lookup: {
                        from: "courses",
                        localField: "_id",
                        foreignField: "_id",
                        as: "course"
                    }
                },
                { $unwind: "$course" },
                // Count students for this course
                {
                    $lookup: {
                        from: "orders",
                        let: { cId: "$_id" },
                        pipeline: [
                            { $match: { status: "paid" } },
                            { $unwind: "$courses" },
                            { $match: { $expr: { $eq: ["$courses", "$$cId"] } } }
                        ],
                        as: "orders"
                    }
                },
                {
                    $project: {
                        courseId: "$_id",
                        title: "$course.title",
                        earnings: 1,
                        studentsCount: { $size: "$orders" }
                    }
                }
            ]);
            return topCourses;
        });
    }
    getEarningsGraph(teacherId, timeframe) {
        return __awaiter(this, void 0, void 0, function* () {
            const tId = new mongoose_1.default.Types.ObjectId(teacherId);
            // Last 6 months
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
            sixMonthsAgo.setDate(1); // Start of that month
            const earnings = yield Transaction_1.Transaction.aggregate([
                {
                    $match: {
                        teacherId: tId,
                        type: "TEACHER_EARNING",
                        createdAt: { $gte: sixMonthsAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" }
                        },
                        amount: { $sum: "$amount" }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]);
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return earnings.map(e => ({
                month: months[e._id.month - 1],
                year: e._id.year,
                amount: e.amount
            }));
        });
    }
    getUpcomingSchedule(teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield Booking_1.Booking.find({
                teacherId: teacherId,
                status: "booked", // or pending/booked
                date: { $gte: new Date().toISOString().split('T')[0] } // From today
            })
                .sort({ date: 1, "slot.start": 1 })
                .limit(4)
                .populate("courseId", "title");
            return bookings.map(b => {
                var _a;
                return ({
                    id: b._id.toString(),
                    day: b.day,
                    date: b.date,
                    timeRange: `${b.slot.start} - ${b.slot.end}`,
                    title: ((_a = b.courseId) === null || _a === void 0 ? void 0 : _a.title) || "Mentorship Session",
                    type: 'class'
                });
            });
        });
    }
};
exports.TeacherDashboardService = TeacherDashboardService;
exports.TeacherDashboardService = TeacherDashboardService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.WalletRepository)),
    __metadata("design:paramtypes", [Object, Object])
], TeacherDashboardService);
