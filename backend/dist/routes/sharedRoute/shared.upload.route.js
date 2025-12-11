"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const sharedController = container_1.default.get(types_1.TYPES.SharedController);
router.post('/upload', upload.single('file'), (0, asyncHandler_1.asyncHandler)(sharedController.uploadFile.bind(sharedController)));
exports.default = router;
