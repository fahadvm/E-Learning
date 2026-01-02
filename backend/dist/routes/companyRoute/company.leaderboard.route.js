"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = __importDefault(require("../../core/di/container"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const router = express_1.default.Router();
const companyLeaderboardController = container_1.default.get(types_1.TYPES.CompanyLeaderboardController);
router.get('/', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(companyLeaderboardController.getLeaderboard.bind(companyLeaderboardController)));
router.get('/search', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(companyLeaderboardController.search.bind(companyLeaderboardController)));
exports.default = router;
