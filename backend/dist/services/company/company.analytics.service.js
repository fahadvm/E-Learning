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
exports.CompanyAnalyticsService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const Employee_1 = require("../../models/Employee");
const EmployeeLearningPathProgress_1 = require("../../models/EmployeeLearningPathProgress");
const EmployeeLearningRecord_1 = require("../../models/EmployeeLearningRecord");
const CompanyOrder_1 = require("../../models/CompanyOrder");
const mongoose_1 = __importDefault(require("mongoose"));
let CompanyAnalyticsService = class CompanyAnalyticsService {
    constructor(_companyRepo) {
        this._companyRepo = _companyRepo;
    }
    getTrackerStats(companyId, range) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const now = new Date();
            const startDate = this.getStartDate(now, range);
            // 1. Total Employees
            const totalEmployees = yield Employee_1.Employee.countDocuments({ companyId: new mongoose_1.default.Types.ObjectId(companyId) });
            // 2. Total Learning Hours (from learning records - convert minutes to hours)
            const learningRecords = yield EmployeeLearningRecord_1.EmployeeLearningRecord.aggregate([
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'employeeId',
                        foreignField: '_id',
                        as: 'employee'
                    }
                },
                { $unwind: '$employee' },
                {
                    $match: {
                        'employee.companyId': new mongoose_1.default.Types.ObjectId(companyId),
                        date: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalMinutes: { $sum: '$totalMinutes' }
                    }
                }
            ]);
            const totalLearningHours = ((_a = learningRecords[0]) === null || _a === void 0 ? void 0 : _a.totalMinutes) ? learningRecords[0].totalMinutes / 60 : 0;
            // 3. Average Completion Rate
            const progressRecords = yield EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.find({
                companyId: new mongoose_1.default.Types.ObjectId(companyId)
            });
            const avgCompletionRate = progressRecords.length > 0
                ? progressRecords.reduce((sum, p) => sum + (p.percentage || 0), 0) / progressRecords.length
                : 0;
            // 4. Total Courses
            const orders = yield CompanyOrder_1.CompanyOrderModel.find({
                companyId: new mongoose_1.default.Types.ObjectId(companyId),
                status: 'paid'
            });
            const uniqueCourses = new Set();
            orders.forEach(order => {
                order.purchasedCourses.forEach(pc => {
                    uniqueCourses.add(pc.courseId.toString());
                });
            });
            const totalCourses = uniqueCourses.size;
            // 5. Graph Data
            const graph = yield this.getGraphData(companyId, range, startDate, now);
            // 6. Most Active & Least Active Employees
            const employeeStats = yield this.getEmployeeStats(companyId, startDate);
            const mostActive = employeeStats.slice(0, 10);
            const leastActive = employeeStats.slice(-10).reverse();
            return {
                totalEmployees,
                totalLearningHours: Math.round(totalLearningHours * 10) / 10,
                avgCompletionRate: Math.round(avgCompletionRate * 10) / 10,
                totalCourses,
                graph,
                mostActive,
                leastActive
            };
        });
    }
    getStartDate(now, range) {
        const date = new Date(now);
        if (range === 'week') {
            date.setDate(date.getDate() - 7);
        }
        else if (range === 'month') {
            date.setMonth(date.getMonth() - 1);
        }
        else if (range === 'year') {
            date.setFullYear(date.getFullYear() - 1);
        }
        return date;
    }
    getGraphData(companyId, range, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const records = yield EmployeeLearningRecord_1.EmployeeLearningRecord.aggregate([
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'employeeId',
                        foreignField: '_id',
                        as: 'employee'
                    }
                },
                { $unwind: '$employee' },
                {
                    $match: {
                        'employee.companyId': new mongoose_1.default.Types.ObjectId(companyId),
                        date: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: '$date',
                        minutes: { $sum: '$totalMinutes' }
                    }
                },
                { $sort: { _id: 1 } }
            ]);
            if (range === 'week') {
                return this.groupByDays(records, startDate);
            }
            else if (range === 'month') {
                return this.groupByWeeks(records, startDate);
            }
            else {
                return this.groupByMonths(records, startDate);
            }
        });
    }
    groupByDays(records, startDate) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const dayName = days[date.getDay()];
            const dayRecords = records.filter(r => {
                const recordDate = new Date(r._id);
                return recordDate.toDateString() === date.toDateString();
            });
            const minutes = dayRecords.reduce((sum, r) => sum + r.minutes, 0);
            const hours = minutes / 60;
            result.push({ label: dayName, hours: Math.round(hours * 10) / 10 });
        }
        return result;
    }
    groupByWeeks(records, startDate) {
        const result = [];
        for (let week = 1; week <= 4; week++) {
            const weekStart = new Date(startDate);
            weekStart.setDate(weekStart.getDate() + (week - 1) * 7);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            const weekRecords = records.filter(r => {
                const recordDate = new Date(r._id);
                return recordDate >= weekStart && recordDate <= weekEnd;
            });
            const minutes = weekRecords.reduce((sum, r) => sum + r.minutes, 0);
            const hours = minutes / 60;
            result.push({ label: `Week ${week}`, hours: Math.round(hours * 10) / 10 });
        }
        return result;
    }
    groupByMonths(records, startDate) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const result = [];
        for (let i = 0; i < 12; i++) {
            const monthDate = new Date(startDate);
            monthDate.setMonth(monthDate.getMonth() + i);
            const monthName = months[monthDate.getMonth()];
            const monthRecords = records.filter(r => {
                const recordDate = new Date(r._id);
                return recordDate.getMonth() === monthDate.getMonth() &&
                    recordDate.getFullYear() === monthDate.getFullYear();
            });
            const minutes = monthRecords.reduce((sum, r) => sum + r.minutes, 0);
            const hours = minutes / 60;
            result.push({ label: monthName, hours: Math.round(hours * 10) / 10 });
        }
        return result;
    }
    getEmployeeStats(companyId, startDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const employees = yield Employee_1.Employee.find({ companyId: new mongoose_1.default.Types.ObjectId(companyId) })
                .select('_id name email')
                .lean();
            const stats = yield Promise.all(employees.map((emp) => __awaiter(this, void 0, void 0, function* () {
                // Get total hours (convert minutes to hours)
                const records = yield EmployeeLearningRecord_1.EmployeeLearningRecord.find({
                    employeeId: emp._id,
                    date: { $gte: startDate }
                });
                const totalMinutes = records.reduce((sum, r) => sum + (r.totalMinutes || 0), 0);
                const totalHours = totalMinutes / 60;
                // Get progress
                const progress = yield EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.find({
                    employeeId: emp._id
                });
                const avgProgress = progress.length > 0
                    ? progress.reduce((sum, p) => sum + (p.percentage || 0), 0) / progress.length
                    : 0;
                return {
                    id: emp._id.toString(),
                    name: emp.name || emp.email,
                    hours: Math.round(totalHours * 10) / 10,
                    progress: Math.round(avgProgress)
                };
            })));
            // Sort by hours (descending)
            return stats.sort((a, b) => b.hours - a.hours);
        });
    }
};
exports.CompanyAnalyticsService = CompanyAnalyticsService;
exports.CompanyAnalyticsService = CompanyAnalyticsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyRepository)),
    __metadata("design:paramtypes", [Object])
], CompanyAnalyticsService);
