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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyAnalyticsService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
let CompanyAnalyticsService = class CompanyAnalyticsService {
    constructor(repo) {
        this.repo = repo;
    }
    getTrackerStats(companyId, range) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const startDate = this.getStartDate(now, range);
            const totalEmployees = yield this.repo.countEmployees(companyId);
            const learningRecords = yield this.repo.getLearningRecords(companyId, startDate);
            const totalMinutes = learningRecords.reduce((sum, r) => { var _a; return sum + ((_a = r.minutes) !== null && _a !== void 0 ? _a : 0); }, 0);
            const totalLearningHours = totalMinutes / 60;
            const progressRecords = yield this.repo.getProgressRecords(companyId);
            const avgCompletionRate = progressRecords.length > 0
                ? progressRecords.reduce((sum, p) => { var _a; return sum + ((_a = p.percentage) !== null && _a !== void 0 ? _a : 0); }, 0) / progressRecords.length
                : 0;
            const orders = yield this.repo.getPaidOrders(companyId);
            const totalCourses = this.countUniqueCourses(orders);
            const graph = yield this.getGraphData(companyId, range, startDate, now);
            const employeeStats = yield this.getEmployeeStats(companyId, startDate);
            const mostActive = employeeStats.slice(0, 10);
            const leastActive = employeeStats.slice(-10).reverse();
            return {
                totalEmployees,
                totalLearningHours: this.round(totalLearningHours),
                avgCompletionRate: this.round(avgCompletionRate),
                totalCourses,
                graph,
                mostActive,
                leastActive
            };
        });
    }
    getStartDate(now, range) {
        const date = new Date(now);
        if (range === "week")
            date.setDate(date.getDate() - 7);
        if (range === "month")
            date.setMonth(date.getMonth() - 1);
        if (range === "year")
            date.setFullYear(date.getFullYear() - 1);
        return date;
    }
    countUniqueCourses(orders) {
        const courseSet = new Set();
        orders.forEach(order => {
            order.purchasedCourses.forEach(pc => courseSet.add(pc.courseId));
        });
        return courseSet.size;
    }
    round(value) {
        return Math.round(value * 10) / 10;
    }
    getGraphData(companyId, range, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const records = yield this.repo.getLearningRecords(companyId, startDate, endDate);
            if (range === "week")
                return this.groupByDays(records, startDate);
            if (range === "month")
                return this.groupByWeeks(records, startDate);
            return this.groupByMonths(records, startDate);
        });
    }
    groupByDays(records, startDate) {
        const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const result = [];
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(startDate);
            dayDate.setDate(dayDate.getDate() + i);
            const filtered = records.filter(r => new Date(r._id).toDateString() === dayDate.toDateString());
            const totalMinutes = filtered.reduce((sum, r) => sum + r.minutes, 0);
            result.push({ label: labels[dayDate.getDay()], hours: this.round(totalMinutes / 60) });
        }
        return result;
    }
    groupByWeeks(records, startDate) {
        const result = [];
        for (let week = 1; week <= 4; week++) {
            const weekStart = new Date(startDate);
            weekStart.setDate(startDate.getDate() + (week - 1) * 7);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            const filtered = records.filter(r => {
                const date = new Date(r._id);
                return date >= weekStart && date <= weekEnd;
            });
            const totalMinutes = filtered.reduce((sum, r) => sum + r.minutes, 0);
            result.push({ label: `Week ${week}`, hours: this.round(totalMinutes / 60) });
        }
        return result;
    }
    groupByMonths(records, startDate) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const result = [];
        for (let i = 0; i < 12; i++) {
            const monthDate = new Date(startDate);
            monthDate.setMonth(monthDate.getMonth() + i);
            const filtered = records.filter(r => {
                const date = new Date(r._id);
                return date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear();
            });
            const totalMinutes = filtered.reduce((sum, r) => sum + r.minutes, 0);
            result.push({ label: months[monthDate.getMonth()], hours: this.round(totalMinutes / 60) });
        }
        return result;
    }
    getEmployeeStats(companyId, startDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const employees = yield this.repo.getEmployees(companyId);
            const stats = yield Promise.all(employees.map((emp) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const learningRecords = yield this.repo.getEmployeeLearningRecords(emp._id, startDate);
                const totalMinutes = learningRecords.reduce((sum, r) => { var _a; return sum + ((_a = r.totalMinutes) !== null && _a !== void 0 ? _a : 0); }, 0);
                const progressRecords = yield this.repo.getEmployeeProgress(emp._id);
                const avgProgress = progressRecords.length > 0
                    ? progressRecords.reduce((sum, p) => { var _a; return sum + ((_a = p.percentage) !== null && _a !== void 0 ? _a : 0); }, 0) / progressRecords.length
                    : 0;
                return {
                    id: emp._id,
                    name: (_a = emp.name) !== null && _a !== void 0 ? _a : emp.email,
                    hours: this.round(totalMinutes / 60),
                    progress: Math.round(avgProgress)
                };
            })));
            return stats.sort((a, b) => b.hours - a.hours);
        });
    }
};
exports.CompanyAnalyticsService = CompanyAnalyticsService;
exports.CompanyAnalyticsService = CompanyAnalyticsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyAnalyticsRepository)),
    __metadata("design:paramtypes", [Object])
], CompanyAnalyticsService);
