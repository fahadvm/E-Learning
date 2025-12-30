"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const router = express_1.default.Router();
const sharedController = container_1.default.get(types_1.TYPES.SharedController);
router.get('/ice-config', (0, asyncHandler_1.asyncHandler)(sharedController.getIceConfig.bind(sharedController)));
exports.default = router;
