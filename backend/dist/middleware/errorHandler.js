"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, _next) {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.log('Error from errorHandler:', message, status);
    res.status(status).json({ ok: false, message });
}
