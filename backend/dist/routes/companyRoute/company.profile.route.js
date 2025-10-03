"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = __importDefault(require("../../core/di/container"));
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const router = express_1.default.Router();
const companyProfileController = container_1.default.get(types_1.TYPES.CompanyProfileController);
router.get('/', (0, asyncHandler_1.asyncHandler)(companyProfileController.getProfile.bind(companyProfileController)));
router.put('/', (0, asyncHandler_1.asyncHandler)(companyProfileController.updateProfile.bind(companyProfileController))); // New route
exports.default = router;
