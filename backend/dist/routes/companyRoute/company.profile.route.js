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
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const router = express_1.default.Router();
const companyProfileController = container_1.default.get(types_1.TYPES.CompanyProfileController);
router.get('/', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(companyProfileController.getProfile.bind(companyProfileController)));
router.post('/verify', (0, authMiddleware_1.authMiddleware)('company'), upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'taxId', maxCount: 1 }
]), (0, asyncHandler_1.asyncHandler)(companyProfileController.verify.bind(companyProfileController)));
router.put('/', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(companyProfileController.updateProfile.bind(companyProfileController)));
// Email Change Routes
router.post('/change-email/send-otp', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(companyProfileController.sendEmailChangeOTP.bind(companyProfileController)));
router.post('/change-email/verify-otp', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(companyProfileController.verifyEmailChangeOTP.bind(companyProfileController)));
// Password Change Route
router.post('/change-password', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(companyProfileController.changePassword.bind(companyProfileController)));
exports.default = router;
