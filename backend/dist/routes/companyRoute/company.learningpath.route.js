"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/companyRoute/company.learningpath.route.ts
const express_1 = __importDefault(require("express"));
const container_1 = __importDefault(require("../../core/di/container"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const router = express_1.default.Router();
const controller = container_1.default.get(types_1.TYPES.CompanyLearningPathController);
router.post('/', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(controller.create.bind(controller)));
router.get('/', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(controller.getAll.bind(controller)));
router.get('/:learningPathId', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(controller.getOne.bind(controller)));
router.put('/:learningPathId', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(controller.update.bind(controller)));
router.delete('/:learningPathId', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(controller.delete.bind(controller)));
router.get('/assigned/:employeeId', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(controller.listAssigned.bind(controller)));
// Assign LP to employee
router.post('/assign', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(controller.assign.bind(controller)));
// Unassign LP from employee
router.delete('/unassign/employee', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(controller.unassign.bind(controller)));
exports.default = router;
