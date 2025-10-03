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
const employeeController = container_1.default.get(types_1.TYPES.CompanyEmployeeController);
router.post('/', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(employeeController.addEmployee.bind(employeeController)));
router.get('/', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(employeeController.getAllEmployees.bind(employeeController)));
router.get('/:employeeId', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(employeeController.getEmployeeById.bind(employeeController)));
router.patch('/block/:employeeId', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(employeeController.blockEmployee.bind(employeeController)));
router.put('/:employeeId', (0, authMiddleware_1.authMiddleware)('company'), (0, asyncHandler_1.asyncHandler)(employeeController.updateEmployee.bind(employeeController)));
exports.default = router;
