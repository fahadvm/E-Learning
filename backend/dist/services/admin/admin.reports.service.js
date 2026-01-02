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
exports.AdminReportsService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
let AdminReportsService = class AdminReportsService {
    constructor(_reportsRepo) {
        this._reportsRepo = _reportsRepo;
    }
    getDashboardStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield this._reportsRepo.getDashboardStats();
            const monthlyRevenue = yield this._reportsRepo.getMonthlyRevenue(new Date().getFullYear());
            const userDistribution = yield this._reportsRepo.getUserDistribution();
            const topCourses = yield this._reportsRepo.getTopCourses(5);
            const companyRevenue = yield this._reportsRepo.getCompanyRevenue();
            const activeTeachers = yield this._reportsRepo.getMostActiveTeachers(5);
            const recentActivity = yield this._reportsRepo.getRecentActivity(10);
            const dailyTrend = yield this._reportsRepo.getDailyTrend(7);
            return {
                stats,
                monthlyRevenue,
                userDistribution,
                topCourses,
                companyRevenue,
                activeTeachers,
                dailyTrend,
                recentActivity
            };
        });
    }
    exportReport(_format) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation for export will be handled here or in controller
            // depending on library usage. Logic: fetch all data -> generate PDF/CSV
            throw new Error(`Export method not implemented for format: ${_format}`);
        });
    }
};
exports.AdminReportsService = AdminReportsService;
exports.AdminReportsService = AdminReportsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminReportsRepository)),
    __metadata("design:paramtypes", [Object])
], AdminReportsService);
