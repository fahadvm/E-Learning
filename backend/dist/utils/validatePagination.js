"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePagination = validatePagination;
function validatePagination(page, limit) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    if (isNaN(pageNum) || pageNum < 1) {
        return { pageNum: null, limitNum: null, error: 'Invalid page number' };
    }
    if (isNaN(limitNum) || limitNum < 1) {
        return { pageNum: null, limitNum: null, error: 'Invalid page limit' };
    }
    return { pageNum, limitNum, error: null };
}
