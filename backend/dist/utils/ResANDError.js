"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwErrorWithRes = throwErrorWithRes;
exports.throwError = throwError;
exports.sendResponse = sendResponse;
exports.handleControllerError = handleControllerError;
function throwErrorWithRes(res, message, statusCode = 400) {
    logger.err('Throwing error:', message);
    res.status(statusCode).json({ message });
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}
function throwError(message, statusCode = 400) {
    logger.err('Throwing error:', message);
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}
function sendResponse(res, status, message, ok, data) {
    console.log(message);
    res.status(status).json({ ok, message, data });
}
function handleControllerError(res, error, defaultStatus = 400) {
    const err = error;
    const statusCode = err.statusCode || defaultStatus;
    logger.err(err.message);
    sendResponse(res, statusCode, err.message, false);
}
