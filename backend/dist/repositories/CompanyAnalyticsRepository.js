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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyAnalyticsRepository = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = __importDefault(require("mongoose"));
const Employee_1 = require("../models/Employee");
const EmployeeLearningRecord_1 = require("../models/EmployeeLearningRecord");
const EmployeeLearningPathProgress_1 = require("../models/EmployeeLearningPathProgress");
const CompanyOrder_1 = require("../models/CompanyOrder");
let CompanyAnalyticsRepository = class CompanyAnalyticsRepository {
    countEmployees(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Employee_1.Employee.countDocuments({ companyId: new mongoose_1.default.Types.ObjectId(companyId) });
        });
    }
    getLearningRecords(companyId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const match = {
                'employee.companyId': new mongoose_1.default.Types.ObjectId(companyId),
                date: { $gte: startDate }
            };
            if (endDate) {
                match.date.$lte = endDate;
            }
            return EmployeeLearningRecord_1.EmployeeLearningRecord.aggregate([
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'employeeId',
                        foreignField: '_id',
                        as: 'employee'
                    }
                },
                { $unwind: '$employee' },
                { $match: match },
                {
                    $group: {
                        _id: '$date',
                        minutes: { $sum: '$totalMinutes' }
                    }
                },
                { $sort: { _id: 1 } }
            ]);
        });
    }
    getProgressRecords(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.find({
                companyId: new mongoose_1.default.Types.ObjectId(companyId)
            }).lean();
        });
    }
    getPaidOrders(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return CompanyOrder_1.CompanyOrderModel.find({
                companyId: new mongoose_1.default.Types.ObjectId(companyId),
                status: 'paid'
            }).lean();
        });
    }
    getEmployees(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Employee_1.Employee.find({
                companyId: new mongoose_1.default.Types.ObjectId(companyId)
            })
                .select('_id name email')
                .lean();
        });
    }
    getEmployeeLearningRecords(employeeId, startDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return EmployeeLearningRecord_1.EmployeeLearningRecord.find({
                employeeId,
                date: { $gte: startDate }
            }).lean();
        });
    }
    getEmployeeProgress(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return EmployeeLearningPathProgress_1.EmployeeLearningPathProgress.find({ employeeId }).lean();
        });
    }
};
exports.CompanyAnalyticsRepository = CompanyAnalyticsRepository;
exports.CompanyAnalyticsRepository = CompanyAnalyticsRepository = __decorate([
    (0, inversify_1.injectable)()
], CompanyAnalyticsRepository);
