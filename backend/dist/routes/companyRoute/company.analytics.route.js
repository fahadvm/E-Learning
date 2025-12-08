"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
const analyticsController = container_1.default.get(types_1.TYPES.CompanyAnalyticsController);
router.get('/tracker', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(analyticsController.getTrackerStats.bind(analyticsController)));
exports.default = router;
