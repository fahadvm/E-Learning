"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const dashboardRouter = express_1.default.Router();
const controller = container_1.default.get(types_1.TYPES.TeacherDashboardController);
dashboardRouter.use((0, authMiddleware_1.authMiddleware)('teacher'));
dashboardRouter.get('/stats', (req, res, next) => {
    controller.getDashboardStats(req, res).catch(next);
});
dashboardRouter.get('/top-courses', (req, res, next) => {
    controller.getTopCourses(req, res).catch(next);
});
dashboardRouter.get('/earnings-graph', (req, res, next) => {
    controller.getEarningsGraph(req, res).catch(next);
});
dashboardRouter.get('/schedule', (req, res, next) => {
    controller.getUpcomingSchedule(req, res).catch(next);
});
exports.default = dashboardRouter;
