"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwErrorWithRes = throwErrorWithRes;
exports.throwError = throwError;
exports.sendResponse = sendResponse;
exports.handleControllerError = handleControllerError;
const logger_1 = __importDefault(require("./logger"));
function throwErrorWithRes(res, message, statusCode = 400) {
    logger_1.default.error('Throwing error:', message);
    res.status(statusCode).json({ message });
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}
function throwError(message, statusCode = 400) {
    console.log('Throwing error in :', message);
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}
function sendResponse(res, status, message, ok, data) {
    logger_1.default.info(message);
    res.status(status).json({ ok, message, data });
}
function handleControllerError(res, error, defaultStatus = 400) {
    const err = error;
    const statusCode = err.statusCode || defaultStatus;
    logger_1.default.error(err.message);
    sendResponse(res, statusCode, err.message, false);
}
