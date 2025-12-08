"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyAnalyticsController = void 0;
const inversify_1 = require("inversify");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResANDError_1 = require("../../utils/ResANDError");
const JWTtoken_1 = require("../../utils/JWTtoken");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const types_1 = require("../../core/di/types");
const company_analytics_service_1 = require("../../services/company/company.analytics.service");
let CompanyAnalyticsController = class CompanyAnalyticsController {
    constructor(_analyticsService) {
        this._analyticsService = _analyticsService;
    }
    getTrackerStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, JWTtoken_1.decodeToken)(req.cookies.token);
            if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { range } = req.query;
            const validRanges = ['week', 'month', 'year'];
            if (!range || !validRanges.includes(range)) {
                (0, ResANDError_1.throwError)('Invalid range. Must be week, month, or year', HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const stats = yield this._analyticsService.getTrackerStats(decoded.id, range);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, 'Tracker stats fetched successfully', true, stats);
        });
    }
};
exports.CompanyAnalyticsController = CompanyAnalyticsController;
exports.CompanyAnalyticsController = CompanyAnalyticsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyAnalyticsService)),
    __metadata("design:paramtypes", [company_analytics_service_1.CompanyAnalyticsService])
], CompanyAnalyticsController);
