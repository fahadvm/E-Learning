"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = __importDefault(require("../../core/di/container"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const types_1 = require("../../core/di/types");
const router = express_1.default.Router();
const companySubscriptionController = container_1.default.get(types_1.TYPES.CompanySubscriptionController);
router.get('/', (0, authMiddleware_1.authMiddleware)('company'), companySubscriptionController.getAllCompanyPlans.bind(companySubscriptionController));
exports.default = router;
