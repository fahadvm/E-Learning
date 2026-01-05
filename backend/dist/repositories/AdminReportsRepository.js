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
exports.AdminReportsRepository = void 0;
const inversify_1 = require("inversify");
const Transaction_1 = require("../models/Transaction");
const Student_1 = require("../models/Student");
const Teacher_1 = require("../models/Teacher");
const Company_1 = require("../models/Company");
const Employee_1 = require("../models/Employee");
const Course_1 = require("../models/Course");
let AdminReportsRepository = class AdminReportsRepository {
    getDashboardStats() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const revenueAgg = yield Transaction_1.Transaction.aggregate([
                { $match: { paymentStatus: 'SUCCESS' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
            const totalRevenue = ((_a = revenueAgg[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            const totalStudents = yield Student_1.Student.countDocuments();
            const totalTeachers = yield Teacher_1.Teacher.countDocuments();
            const totalCompanies = yield Company_1.Company.countDocuments();
            const totalCourses = yield Course_1.Course.countDocuments({ isPublished: true });
            return { totalRevenue, totalStudents, totalTeachers, totalCompanies, totalCourses };
        });
    }
    getRecentActivity(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch recent purchases
            const recentPurchases = yield Transaction_1.Transaction.find({ type: 'COURSE_PURCHASE', paymentStatus: 'SUCCESS' })
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate('userId', 'name')
                .populate('courseId', 'title')
                .lean();
            // Fetch recent course uploads
            const recentCourses = yield Course_1.Course.find({ isPublished: true })
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate('teacherId', 'name')
                .lean();
            // Fetch recent student signups
            const recentStudents = yield Student_1.Student.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
            const activities = [];
            recentPurchases.forEach((tx) => {
                var _a, _b;
                activities.push({
                    type: 'purchase',
                    user: ((_a = tx.userId) === null || _a === void 0 ? void 0 : _a.name) || 'Someone',
                    action: 'enrolled in',
                    target: ((_b = tx.courseId) === null || _b === void 0 ? void 0 : _b.title) || 'a course',
                    time: tx.createdAt,
                });
            });
            recentCourses.forEach((course) => {
                var _a;
                activities.push({
                    type: 'upload',
                    user: ((_a = course.teacherId) === null || _a === void 0 ? void 0 : _a.name) || 'A teacher',
                    action: 'published',
                    target: course.title,
                    time: course.createdAt,
                });
            });
            recentStudents.forEach((student) => {
                activities.push({
                    type: 'signup',
                    user: student.name,
                    action: 'joined',
                    target: 'as a student',
                    time: student.createdAt,
                });
            });
            // Sort by time and limit
            return activities
                .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                .slice(0, limit);
        });
    }
    getMonthlyRevenue(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = new Date(year, 0, 1);
            const end = new Date(year + 1, 0, 1);
            return yield Transaction_1.Transaction.aggregate([
                {
                    $match: {
                        paymentStatus: 'SUCCESS',
                        createdAt: { $gte: start, $lt: end }
                    }
                },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        revenue: { $sum: '$amount' }
                    }
                },
                { $sort: { '_id': 1 } }
            ]);
        });
    }
    getYearlyRevenue() {
        return __awaiter(this, arguments, void 0, function* (years = 5) {
            const start = new Date();
            start.setFullYear(start.getFullYear() - years);
            return yield Transaction_1.Transaction.aggregate([
                {
                    $match: {
                        paymentStatus: 'SUCCESS',
                        createdAt: { $gte: start }
                    }
                },
                {
                    $group: {
                        _id: { $year: '$createdAt' },
                        revenue: { $sum: '$amount' }
                    }
                },
                { $sort: { '_id': 1 } }
            ]);
        });
    }
    getUserDistribution() {
        return __awaiter(this, void 0, void 0, function* () {
            const students = yield Student_1.Student.countDocuments();
            const teachers = yield Teacher_1.Teacher.countDocuments();
            const companies = yield Company_1.Company.countDocuments();
            const employees = yield Employee_1.Employee.countDocuments();
            return [
                { name: 'Students', value: students },
                { name: 'Teachers', value: teachers },
                { name: 'Companies', value: companies },
                { name: 'Employees', value: employees },
            ];
        });
    }
    getTopCourses(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Transaction_1.Transaction.aggregate([
                { $match: { paymentStatus: 'SUCCESS', courseId: { $exists: true } } },
                { $group: { _id: '$courseId', sales: { $sum: 1 }, revenue: { $sum: '$amount' } } },
                { $sort: { sales: -1 } },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'courses',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'course'
                    }
                },
                { $unwind: '$course' },
                {
                    $project: {
                        _id: { $toString: '$_id' },
                        title: '$course.title',
                        sales: 1,
                        revenue: 1
                    }
                }
            ]);
        });
    }
    getCompanyRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Transaction_1.Transaction.aggregate([
                { $match: { paymentStatus: 'SUCCESS', companyId: { $exists: true } } },
                { $group: { _id: '$companyId', totalRevenue: { $sum: '$amount' } } },
                { $sort: { totalRevenue: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: 'companies',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'company'
                    }
                },
                { $unwind: '$company' },
                {
                    $project: {
                        name: '$company.name',
                        revenue: '$totalRevenue'
                    }
                }
            ]);
        });
    }
    getMostActiveTeachers(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Transaction_1.Transaction.aggregate([
                { $match: { paymentStatus: 'SUCCESS', teacherId: { $exists: true } } },
                { $group: { _id: '$teacherId', totalRevenue: { $sum: '$amount' }, transactions: { $sum: 1 } } },
                { $sort: { transactions: -1 } },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'teachers',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'teacher'
                    }
                },
                { $unwind: '$teacher' },
                {
                    $project: {
                        name: '$teacher.name',
                        email: '$teacher.email',
                        revenue: '$totalRevenue',
                        transactions: '$transactions'
                    }
                }
            ]);
        });
    }
    getDailyTrend(days) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = new Date();
            start.setDate(start.getDate() - days);
            return yield Transaction_1.Transaction.aggregate([
                {
                    $match: {
                        paymentStatus: 'SUCCESS',
                        createdAt: { $gte: start }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        sales: { $sum: 1 },
                        revenue: { $sum: '$amount' }
                    }
                },
                { $sort: { '_id': 1 } }
            ]);
        });
    }
};
exports.AdminReportsRepository = AdminReportsRepository;
exports.AdminReportsRepository = AdminReportsRepository = __decorate([
    (0, inversify_1.injectable)()
], AdminReportsRepository);
