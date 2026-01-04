"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = __importDefault(require("../utils/logger"));
function errorHandler(err, req, res, _next) {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    logger_1.default.error(`Error from errorHandler: ${message}${status}`);
    res.status(status).json({ ok: false, message });
}
