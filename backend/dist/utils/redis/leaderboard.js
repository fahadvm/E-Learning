"use strict";
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
exports.removeFromCompanyLeaderboard = exports.updateCompanyLeaderboard = void 0;
const redisClient_1 = require("../redisClient");
const updateCompanyLeaderboard = (companyId, employeeId, totalMinutes, completedCourses, streakCount) => __awaiter(void 0, void 0, void 0, function* () {
    // Balanced weighted score
    const score = (totalMinutes * 10) + (completedCourses * 50) + (streakCount * 2);
    yield redisClient_1.redis.zadd(`leaderboard:${companyId}`, score, employeeId);
});
exports.updateCompanyLeaderboard = updateCompanyLeaderboard;
const removeFromCompanyLeaderboard = (companyId, employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient_1.redis.zrem(`leaderboard:${companyId}`, employeeId);
});
exports.removeFromCompanyLeaderboard = removeFromCompanyLeaderboard;
