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
exports.EmployeeLeaderboardService = void 0;
const inversify_1 = require("inversify");
const Employee_1 = require("../../models/Employee");
const EmployeeLearningRecord_1 = require("../../models/EmployeeLearningRecord");
const dayjs_1 = __importDefault(require("dayjs"));
const mongoose_1 = __importDefault(require("mongoose"));
let EmployeeLeaderboardService = class EmployeeLeaderboardService {
    format(data, employeeId) {
        const leaderboard = data
            .map((item) => ({
            _id: item._id.toString(),
            name: item.name,
            hours: Math.round((item.totalMinutes || 0)),
            streak: item.streakCount || 0,
            courses: item.completedCourses || 0,
            isYou: item._id.toString() === employeeId,
        }))
            .sort((a, b) => b.hours - a.hours)
            .map((item, index) => (Object.assign(Object.assign({}, item), { rank: index + 1 })));
        const you = leaderboard.find((u) => u._id === employeeId);
        return { leaderboard, you };
    }
    getAllTimeLeaderboard(employeeId, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield Employee_1.Employee.aggregate([
                { $match: { companyId: new mongoose_1.default.Types.ObjectId(companyId) } },
                {
                    $addFields: {
                        completedCourses: {
                            $size: {
                                $filter: {
                                    input: "$coursesProgress",
                                    as: "c",
                                    cond: { $eq: ["$$c.percentage", 100] }
                                }
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "employeelearningrecords",
                        localField: "_id",
                        foreignField: "employeeId",
                        as: "records"
                    }
                },
                { $addFields: { totalMinutes: { $sum: "$records.totalMinutes" } } }
            ]);
            return this.format(users, employeeId);
        });
    }
    getWeeklyLeaderboard(employeeId, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const startOfWeek = (0, dayjs_1.default)().startOf("week").toDate();
            const data = yield EmployeeLearningRecord_1.EmployeeLearningRecord.aggregate([
                { $match: { date: { $gte: startOfWeek } } },
                {
                    $lookup: {
                        from: "employees",
                        localField: "employeeId",
                        foreignField: "_id",
                        as: "emp"
                    }
                },
                { $unwind: "$emp" },
                { $match: { "emp.companyId": new mongoose_1.default.Types.ObjectId(companyId) } },
                {
                    $group: {
                        _id: "$employeeId",
                        totalMinutes: { $sum: "$totalMinutes" },
                        name: { $first: "$emp.name" },
                        streakCount: { $first: "$emp.streakCount" },
                        coursesProgress: { $first: "$emp.coursesProgress" }
                    }
                },
                {
                    $addFields: {
                        completedCourses: {
                            $size: {
                                $filter: {
                                    input: "$coursesProgress",
                                    as: "c",
                                    cond: { $eq: ["$$c.percentage", 100] }
                                }
                            }
                        }
                    }
                }
            ]);
            return this.format(data, employeeId);
        });
    }
    getMonthlyLeaderboard(employeeId, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const startOfMonth = (0, dayjs_1.default)().startOf("month").toDate();
            const data = yield EmployeeLearningRecord_1.EmployeeLearningRecord.aggregate([
                { $match: { date: { $gte: startOfMonth } } },
                {
                    $lookup: {
                        from: "employees",
                        localField: "employeeId",
                        foreignField: "_id",
                        as: "emp"
                    }
                },
                { $unwind: "$emp" },
                { $match: { "emp.companyId": new mongoose_1.default.Types.ObjectId(companyId) } },
                {
                    $group: {
                        _id: "$employeeId",
                        totalMinutes: { $sum: "$totalMinutes" },
                        name: { $first: "$emp.name" },
                        streakCount: { $first: "$emp.streakCount" },
                        coursesProgress: { $first: "$emp.coursesProgress" }
                    }
                },
                {
                    $addFields: {
                        completedCourses: {
                            $size: {
                                $filter: {
                                    input: "$coursesProgress",
                                    as: "c",
                                    cond: { $eq: ["$$c.percentage", 100] }
                                }
                            }
                        }
                    }
                }
            ]);
            return this.format(data, employeeId);
        });
    }
};
exports.EmployeeLeaderboardService = EmployeeLeaderboardService;
exports.EmployeeLeaderboardService = EmployeeLeaderboardService = __decorate([
    (0, inversify_1.injectable)()
], EmployeeLeaderboardService);
