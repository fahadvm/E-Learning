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
exports.CompanyLeaderboardService = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = __importDefault(require("mongoose"));
const Employee_1 = require("../../models/Employee");
const EmployeeLearningRecord_1 = require("../../models/EmployeeLearningRecord");
const redisClient_1 = require("../../utils/redisClient");
let CompanyLeaderboardService = class CompanyLeaderboardService {
    // Get Top 50 Employees (Ranked from Redis)
    getTop50(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const key = `leaderboard:${companyId}`;
            const entries = yield redisClient_1.redis.zrevrange(key, 0, 49, 'WITHSCORES');
            const ranked = [];
            for (let i = 0; i < entries.length; i += 2) {
                ranked.push({ employeeId: entries[i], score: Number(entries[i + 1]) });
            }
            const employeeIds = ranked.map((x) => new mongoose_1.default.Types.ObjectId(x.employeeId));
            const employees = yield Employee_1.Employee.find({ _id: { $in: employeeIds } })
                .select('_id name profilePicture coursesProgress streakCount companyId')
                .lean();
            // Compute course count & total learning minutes
            const learningRecords = yield EmployeeLearningRecord_1.EmployeeLearningRecord.aggregate([
                { $match: { employeeId: { $in: employeeIds } } },
                { $group: { _id: '$employeeId', totalMinutes: { $sum: '$totalMinutes' } } }
            ]);
            const result = [];
            let currentRank = 1;
            for (const item of ranked) {
                const emp = employees.find(e => e._id.toString() === item.employeeId);
                // Safety check: if employee no longer exists or belongs to another company, skip and clean Redis
                if (!emp || ((_a = emp.companyId) === null || _a === void 0 ? void 0 : _a.toString()) !== companyId) {
                    yield redisClient_1.redis.zrem(key, item.employeeId);
                    continue;
                }
                const learning = learningRecords.find(l => l._id.toString() === item.employeeId);
                result.push({
                    _id: item.employeeId,
                    name: emp.name,
                    avatar: (_b = emp.profilePicture) !== null && _b !== void 0 ? _b : null,
                    hours: Math.round((learning === null || learning === void 0 ? void 0 : learning.totalMinutes) || 0),
                    courses: ((_c = emp.coursesProgress) === null || _c === void 0 ? void 0 : _c.filter(c => c.percentage === 100).length) || 0,
                    streak: emp.streakCount || 0,
                    rank: currentRank++
                });
            }
            return result;
        });
    }
    // Search ANY employee rank (even if not in Top 50)
    searchEmployee(companyId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const employee = yield Employee_1.Employee.findOne({
                companyId,
                name: { $regex: name, $options: 'i' }
            }).lean();
            if (!employee)
                return null;
            // Compute completed courses
            const completedCourses = ((_a = employee.coursesProgress) === null || _a === void 0 ? void 0 : _a.filter(c => c.percentage === 100).length) || 0;
            // Get total learning minutes from records
            const learning = yield EmployeeLearningRecord_1.EmployeeLearningRecord.aggregate([
                { $match: { employeeId: employee._id, companyId: new mongoose_1.default.Types.ObjectId(companyId) } },
                { $group: { _id: '$employeeId', totalMinutes: { $sum: '$totalMinutes' } } }
            ]);
            const totalMinutes = learning.length > 0 ? learning[0].totalMinutes : 0;
            // Score formula
            const score = (totalMinutes * 10) + (completedCourses * 50) + (employee.streakCount * 2);
            const key = `leaderboard:${companyId}`;
            yield redisClient_1.redis.zadd(key, score, employee._id.toString());
            const rankIndex = yield redisClient_1.redis.zrevrank(key, employee._id.toString());
            const rank = rankIndex !== null ? rankIndex + 1 : null;
            return {
                _id: employee._id.toString(),
                name: employee.name,
                avatar: (_b = employee.profilePicture) !== null && _b !== void 0 ? _b : null,
                hours: Math.round(totalMinutes),
                courses: completedCourses,
                streak: employee.streakCount,
                rank
            };
        });
    }
};
exports.CompanyLeaderboardService = CompanyLeaderboardService;
exports.CompanyLeaderboardService = CompanyLeaderboardService = __decorate([
    (0, inversify_1.injectable)()
], CompanyLeaderboardService);
