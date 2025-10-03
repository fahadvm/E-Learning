"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.log('this error message from errorHandler:', message, status);
    res.status(status).json({ ok: false, message });
}
